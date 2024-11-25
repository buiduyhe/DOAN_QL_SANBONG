import locale
import os
import random
import string
from routers.schemas import HoaDonDisplay, PostBase, TimeSlotDisplay, TimeSlotRequest,TimeSlotResponse
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DatSan, DichVu, DichVu_LoaiDichVu, SanBong,LoaiSanBong, SysUser, TimeSlot,ChiTietHoaDon,HoaDon
from routers import schemas
from db import db_user,db_san,db_dichvu
import pandas as pd
from fastapi.responses import FileResponse
from datetime import datetime, timedelta
from collections import defaultdict


def get_all_san(db: Session):
    return db.query(SanBong).all()

def get_all_loai_san(db: Session):
    return db.query(LoaiSanBong).all()

def get_time_slot(db: Session):
    time_slots = db.query(TimeSlot).distinct(TimeSlot.start_time, TimeSlot.end_time).all()
    unique_slots = []
    seen_slots = set()
    for slot in time_slots:
        if (slot.start_time, slot.end_time) not in seen_slots:
            seen_slots.add((slot.start_time, slot.end_time))
            unique_slots.append(TimeSlotResponse(start_time=slot.start_time, end_time=slot.end_time))
    return unique_slots

def get_id_timeslot(request,db: Session):
    time_slot = db.query(TimeSlot).filter(TimeSlot.san_id == request.san_id, TimeSlot.date == request.ngay_dat,TimeSlot.start_time == request.batdau).first()
    if not time_slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy time slot.")
    return {"id": time_slot.id}

def get_timeslot_by_id(id:int,db: Session):
    time_slot = db.query(TimeSlot).filter(TimeSlot.id == id).first()
    if not time_slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy time slot.")
    return TimeSlotDisplay(
        id = time_slot.id,
        san_id = time_slot.san_id,
        ngay = time_slot.date,
        batdau = time_slot.start_time,
        ketthuc = time_slot.end_time,
        tinhtrang = time_slot.is_available
    )
    
def dat_san(request, db: Session):
    time_slot = db.query(TimeSlot).filter(TimeSlot.id == request.timeslot_id).first()
    if not time_slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy time slot.")
    if not time_slot.is_available:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Khung giờ đã được đặt trước.")
    
    create_dat = create_dat_san(db, request)
    
    if create_dat:
        new_hoadon = HoaDon(
            ma_hoa_don = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            id_user = request.user_id,
            ngay_tao = datetime.datetime.now(),
            trang_thai = 0,##chưa thanh toán
            tong_tien = request.gia
        ) 
        db.add(new_hoadon)
        db.flush()
        
        new_chitiet = ChiTietHoaDon(
            hoa_don_id = new_hoadon.id,
            dat_san_id = create_dat.id,
            so_luong = 1
        )
        db.add(new_chitiet)
        time_slot.is_available = False
    db.commit()
    
    return create_dat

def create_dat_san(db, request):
    new_dat_san = DatSan(
        user_id=request.user_id,
        id_san=request.san_id,
        timeslot_id=request.timeslot_id,
        gia=request.gia
    )
    db.add(new_dat_san)
    db.flush()
    return new_dat_san

def get_san_available(request:TimeSlotRequest, db: Session):
    san_available = db.query(TimeSlot).filter( TimeSlot.start_time == request.batdau, TimeSlot.date == request.ngay_dat).all()
    san_available_responses = []
    for san in san_available:
        san_available_responses.append(schemas.SanAvailableResponse(
            id=san.id,
            san_id=san.san_id,
            ngay=san.date,
            batdau=san.start_time,
            ketthuc=san.end_time,
            tinhtrang=san.is_available
        ))
    return san_available_responses
def get_user_by_id(db: Session, id: int):
    user = db.query(SysUser).filter(SysUser.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng.")
    return user
def get_ds_hoadon(db: Session):
    hoadon_list = db.query(HoaDon).order_by(HoaDon.trang_thai).all()
    if not hoadon_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn nào.")
    hoadon_display_list = []
    for index, hd in enumerate(hoadon_list, start=1):
        user_name = get_user_by_id(db, hd.id_user)
        hoadon_display_list.append(
            HoaDonDisplay(
                STT=index,
                id=hd.id,
                ma_hoa_don=hd.ma_hoa_don,
                id_nguoi_dat=hd.id_user,
                ngay_tao=hd.ngay_tao,
                trangthai=hd.trang_thai,
                tongtien=hd.tong_tien,
                ten_nguoi_dat=user_name.email
            )
        )
    return hoadon_display_list


locale.setlocale(locale.LC_ALL, 'vi_VN')  # Thiết lập locale để hỗ trợ định dạng tiền tệ

def in_hoadon_excel(db: Session, hoa_don_id: int):
    hoadon = db.query(HoaDon).filter(HoaDon.id == hoa_don_id).first()
    if not hoadon:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn.")
    
    chi_tiet = db_dichvu.get_chi_tiet_hoa_don(db, hoa_don_id)
    user = get_user_by_id(db, hoadon.id_user)
    hoadon.trang_thai = 1

    temp_dir = "temp_invoices"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, f'hoa_don_{hoadon.ma_hoa_don}.xlsx')

    with pd.ExcelWriter(file_path, engine='xlsxwriter') as writer:
        workbook = writer.book
        worksheet = workbook.add_worksheet("Hóa đơn")
        writer.sheets['Hóa đơn'] = worksheet

        bold_format = workbook.add_format({'bold': True, 'font_size': 12})
        normal_format = workbook.add_format({'font_size': 12})
        title_format = workbook.add_format({
            'bold': True,
            'font_size': 18,
            'align': 'center',
            'valign': 'vcenter'
        })

        worksheet.merge_range(0, 0, 0, 4, "Sân bóng đá MINI SPORTPLUS", title_format)
        worksheet.merge_range(1, 0, 1, 4, "ĐỊA CHỈ: 140 Lê Trọng Tấn", bold_format)
        worksheet.merge_range(2, 0, 2, 4, "Số điện thoại: 0123456789", bold_format)
        worksheet.merge_range(4, 0, 4, 4, "HÓA ĐƠN BÁN HÀNG", title_format)

        start_row = 6
        worksheet.write(start_row, 0, "Tên khách:", bold_format)
        worksheet.write(start_row, 1, user.email, normal_format)

        worksheet.write(start_row + 1, 0, "MÃ HÓA ĐƠN:", bold_format)
        worksheet.write(start_row + 1, 1, hoadon.ma_hoa_don, normal_format)

        # Định dạng ngày
        ngay_tao = hoadon.ngay_tao.strftime("%d/%m/%Y")
        worksheet.write(start_row + 2, 0, "Ngày Đặt:", bold_format)
        worksheet.write(start_row + 2, 1, ngay_tao, normal_format)

        worksheet.write(start_row + 3, 0, "Trạng Thái:", bold_format)
        worksheet.write(start_row + 3, 1, "Chưa thanh toán" if hoadon.trang_thai == 0 else "Đã thanh toán", normal_format)

        worksheet.set_column('A:A', 15)
        worksheet.set_column('B:B', 30)
        worksheet.set_column('C:C', 12)
        worksheet.set_column('D:D', 15)
        worksheet.set_column('E:E', 15)

        items_data = {
            "STT": list(range(1, len(chi_tiet) + 1)),
            "Tên Sản phẩm": [item["ten_san_pham"] for item in chi_tiet],
            "Số lượng": [item["so_luong"] for item in chi_tiet],
            "Đơn giá": [locale.format_string("%d", item["don_gia"], grouping=True) + " VND" for item in chi_tiet],
            "Tổng Tiền": [locale.format_string("%d", item["tong_tien"], grouping=True) + " VND" for item in chi_tiet]
        }
        items_df = pd.DataFrame(items_data)

        items_format = workbook.add_format({'font_size': 12, 'border': 1, 'align': 'center', 'valign': 'vcenter'})
        header_items_format = workbook.add_format({
            'bold': True,
            'font_size': 12,
            'border': 1,
            'bg_color': '#D7E4BC',
            'align': 'center',
            'valign': 'vcenter'
        })
        start_table_row = start_row + 5
        items_df.to_excel(writer, sheet_name='Hóa đơn', index=False, startrow=start_table_row)

        for col_num, value in enumerate(items_df.columns):
            worksheet.write(start_table_row, col_num, value, header_items_format)

        for row_num in range(len(items_df)):
            for col_num, value in enumerate(items_df.iloc[row_num]):
                worksheet.write(start_table_row + row_num + 1, col_num, value, items_format)

        total_format = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'right'})
        worksheet.write(start_table_row + len(items_df) + 2, 3, "Tổng tiền hóa đơn:", total_format)
        worksheet.write(start_table_row + len(items_df) + 2, 4, f"{locale.format_string('%d', hoadon.tong_tien, grouping=True)} VND", items_format)
    db.commit()
    return FileResponse(
        path=file_path, 
        filename=f'hoa_don_{hoadon.ma_hoa_don}.xlsx', 
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={"Content-Disposition": f"attachment; filename=hoa_don_{hoadon.ma_hoa_don}.xlsx"}
    )
    
    
def ThongKe_30days(db: Session):
    now = datetime.now()
    start_of_today = datetime.combine(now.date(), datetime.min.time())  # Bắt đầu ngày hôm nay
    start_of_thirty_days_ago = start_of_today - timedelta(days=29)  # Bắt đầu cách đây 30 ngày

    # Lấy các hóa đơn trong khoảng thời gian và đã thanh toán
    hoadon_list = db.query(HoaDon).filter(
        HoaDon.ngay_tao >= start_of_thirty_days_ago,
        HoaDon.ngay_tao <= now,
        HoaDon.trang_thai == 1  # Chỉ tính hóa đơn đã thanh toán
    ).all()

    if not hoadon_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn đã thanh toán nào trong 30 ngày gần nhất.")

    thong_ke = {}
    for hd in hoadon_list:
        # Chỉ lấy phần ngày
        ngay_tao = hd.ngay_tao.date()
        if ngay_tao not in thong_ke:
            thong_ke[ngay_tao] = 0
        thong_ke[ngay_tao] += hd.tong_tien

    # Chuyển đổi thành danh sách và sắp xếp theo ngày
    thong_ke_list = [{"ngay": ngay, "tong_tien": tong_tien} for ngay, tong_tien in thong_ke.items()]
    thong_ke_list.sort(key=lambda x: x["ngay"])

    return thong_ke_list


def ThongKe_12months(db: Session):
    now = datetime.now()
    # Ngày hiện tại
    start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    # Ngày cách đây 12 tháng
    twelve_months_ago = start_of_today - timedelta(days=365)

    # Lấy các hóa đơn trong khoảng thời gian 12 tháng gần nhất và đã thanh toán
    hoadon_list = db.query(HoaDon).filter(
        HoaDon.ngay_tao >= twelve_months_ago,
        HoaDon.ngay_tao <= now,
        HoaDon.trang_thai == 1  # Chỉ tính hóa đơn đã thanh toán
    ).all()

    if not hoadon_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn đã thanh toán nào trong 12 tháng gần nhất.")

    # Khởi tạo thống kê theo tháng
    thong_ke = defaultdict(int)
    for hd in hoadon_list:
        # Lấy phần tháng và năm từ ngày tạo hóa đơn
        thang_nam_tao = hd.ngay_tao.strftime("%Y-%m")
        thong_ke[thang_nam_tao] += hd.tong_tien

    # Tạo danh sách các tháng từ 12 tháng trước (bao gồm tháng hiện tại)
    months = []
    current_date = now
    for _ in range(12):
        months.append(current_date.strftime("%Y-%m"))
        # Di chuyển về tháng trước
        prev_month = (current_date.month - 1) or 12
        prev_year = current_date.year if current_date.month > 1 else current_date.year - 1
        current_date = current_date.replace(year=prev_year, month=prev_month)

    months.reverse()  # Đảo ngược danh sách để hiển thị từ xa đến gần

    # Lấp đầy dữ liệu cho những tháng không có hóa đơn
    thong_ke_list = [{"thang_nam": month, "tong_tien": thong_ke.get(month, 0)} for month in months]

    return thong_ke_list