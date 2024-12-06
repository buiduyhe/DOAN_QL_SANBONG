import locale
import os
import random
import string
from routers.schemas import HoaDonDisplay, PostBase, TimeSlotDisplay, TimeSlotRequest,TimeSlotResponse,SanBongUpdateRequest
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import ChiTietNhapHang, DatSan, DichVu, DichVu_LoaiDichVu, NhapHang, SanBong,LoaiSanBong, SysUser, TimeSlot,ChiTietHoaDon,HoaDon,NhaCungCap
from routers import schemas
from db import db_user,db_san,db_dichvu,db_auth
import pandas as pd
from fastapi.responses import FileResponse
from datetime import datetime, timedelta
from collections import defaultdict


def get_all_Ncc(db: Session):
    query = db.query(NhaCungCap).all()
    if not query:
        raise HTTPException(status_code=404, detail="Không tìm thấy Nhà cung cấp nào.")
    return query
def get_Ncc_by_id(db: Session, id: int):
    query = db.query(NhaCungCap).filter(NhaCungCap.id == id).first()
    return query
def get_Ncc_by_name(db: Session, tenNcc: str):
    query = db.query(NhaCungCap).filter(NhaCungCap.ten_ncc == tenNcc).first()
    return query

def create_Ncc(db: Session, tenNcc: str, diachi: str, sdt: str, email: str):
    new_Ncc = NhaCungCap(
        ten_ncc=tenNcc, 
        dia_chi=diachi, 
        sdt=sdt, 
        email=email
        )
    db.add(new_Ncc)
    db.commit()
    return {"message": "Tạo Nhà cung cấp thành công."}

def update_Ncc(db: Session, id: int, Ncc: schemas.UpdateNCC):
    if not Ncc.email or "@" not in Ncc.email:
        raise HTTPException(status_code=400, detail="Email không đúng định dạng.")
    
    if not db_auth.check_phone_number_valid(phone=Ncc.sdt):
        raise HTTPException(status_code=400, detail="Số điện thoại không hợp lệ.")
    
    query = db.query(NhaCungCap).filter(NhaCungCap.id == id).first()
    query.ten_ncc = Ncc.ten_ncc
    query.dia_chi = Ncc.dia_chi
    query.sdt = Ncc.sdt
    query.email = Ncc.email
    db.commit()
    return {"message": "Cập nhật Nhà cung cấp thành công."}


def in_hoadon_nhap_excel(db: Session, nhap_hang_id: int):
    # Retrieve the purchase order
    phieunhap = db.query(NhapHang).filter(NhapHang.id == nhap_hang_id).first()
    if not phieunhap:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập.")
    
    # Retrieve the details of the purchase order
    chitiet = db.query(ChiTietNhapHang).filter(ChiTietNhapHang.nhap_hang_id == nhap_hang_id).all()
    
    # Retrieve supplier information
    nha_cung_cap = db.query(NhaCungCap).filter(NhaCungCap.id == phieunhap.ncc_id).first()

    # Retrieve service names
    dich_vu_ids = [item.dich_vu_id for item in chitiet]
    dich_vu_map = {
        dv.id: dv.ten_dv for dv in db.query(DichVu).filter(DichVu.id.in_(dich_vu_ids)).all()
    }

    temp_dir = "temp_invoices"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, f'phieu_nhap_{phieunhap.ma_phieu_nhap}.xlsx')

    with pd.ExcelWriter(file_path, engine='xlsxwriter') as writer:
        workbook = writer.book
        worksheet = workbook.add_worksheet("Phiếu nhập")
        writer.sheets['Phiếu nhập'] = worksheet

        bold_format = workbook.add_format({'bold': True, 'font_size': 12})
        normal_format = workbook.add_format({'font_size': 12})
        title_format = workbook.add_format({
            'bold': True,
            'font_size': 18,
            'align': 'center',
            'valign': 'vcenter'
        })

        worksheet.merge_range(0, 0, 0, 4, "Công ty TNHH Nhập Hàng", title_format)
        worksheet.merge_range(1, 0, 1, 4, "ĐỊA CHỈ: 123 Phạm Văn Đồng", bold_format)
        worksheet.merge_range(2, 0, 2, 4, "Số điện thoại: 0987654321", bold_format)
        worksheet.merge_range(4, 0, 4, 4, "PHIẾU NHẬP HÀNG", title_format)

        start_row = 6
        worksheet.write(start_row, 0, "Nhà cung cấp:", bold_format)
        worksheet.write(start_row, 1, nha_cung_cap.ten_ncc, normal_format)

        worksheet.write(start_row + 1, 0, "MÃ PHIẾU NHẬP:", bold_format)
        worksheet.write(start_row + 1, 1, phieunhap.ma_phieu_nhap, normal_format)

        # Format the date
        ngay_tao = phieunhap.ngay_nhap.strftime("%d/%m/%Y")
        worksheet.write(start_row + 2, 0, "Ngày nhập:", bold_format)
        worksheet.write(start_row + 2, 1, ngay_tao, normal_format)

        worksheet.set_column('A:A', 15)
        worksheet.set_column('B:B', 30)
        worksheet.set_column('C:C', 12)
        worksheet.set_column('D:D', 15)
        worksheet.set_column('E:E', 15)

        # Prepare the data for the table
        items_data = {
            "STT": list(range(1, len(chitiet) + 1)),
            "Tên Sản phẩm": [dich_vu_map.get(item.dich_vu_id, "Unknown") for item in chitiet],
            "Số lượng": [item.so_luong for item in chitiet],
            "Đơn giá": [locale.format_string("%d", item.don_gia, grouping=True) + " VND" for item in chitiet],
            "Tổng Tiền": [locale.format_string("%d", item.thanh_tien, grouping=True) + " VND" for item in chitiet]
        }
        items_df = pd.DataFrame(items_data)

        # Write the data to the Excel sheet
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
        items_df.to_excel(writer, sheet_name='Phiếu nhập', index=False, startrow=start_table_row)

        for col_num, value in enumerate(items_df.columns):
            worksheet.write(start_table_row, col_num, value, header_items_format)

        for row_num in range(len(items_df)):
            for col_num, value in enumerate(items_df.iloc[row_num]):
                worksheet.write(start_table_row + row_num + 1, col_num, value, items_format)

        total_format = workbook.add_format({'bold': True, 'font_size': 12, 'align': 'right'})
        worksheet.write(start_table_row + len(items_df) + 2, 3, "Tổng tiền phiếu nhập:", total_format)
        worksheet.write(start_table_row + len(items_df) + 2, 4, f"{locale.format_string('%d', phieunhap.tong_tien, grouping=True)} VND", items_format)

    return FileResponse(
        path=file_path,
        filename=f'phieu_nhap_{phieunhap.ma_phieu_nhap}.xlsx',
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={"Content-Disposition": f"attachment; filename=phieu_nhap_{phieunhap.ma_phieu_nhap}.xlsx"}
    )
