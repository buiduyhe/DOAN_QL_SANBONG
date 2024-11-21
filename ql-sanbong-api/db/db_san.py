import random
import string
from routers.schemas import HoaDonDisplay, PostBase, TimeSlotDisplay, TimeSlotRequest,TimeSlotResponse
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DatSan, DichVu, DichVu_LoaiDichVu, SanBong,LoaiSanBong, SysUser, TimeSlot,ChiTietHoaDon,HoaDon
from routers import schemas



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
    hoadon_list = db.query(HoaDon).all()
    if not hoadon_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy hóa đơn nào.")
    hoadon_display_list = []
    for hd in hoadon_list:
        user_name = get_user_by_id(db, hd.id_user)
        hoadon_display_list.append(
            HoaDonDisplay(
                id=hd.id,
                ma_hoa_don=hd.ma_hoa_don,
                id_nguoi_dat=hd.id_user,
                ngay_tao=hd.ngay_tao,
                trangthai=hd.trang_thai,
                tongtien=hd.tong_tien,
                ten_nguoi_dat=user_name.full_name
            )
        )
    return hoadon_display_list

# def get_ct_hoadon_by_mahd(hoadon_id:int,db:Session):
#     chitiet_list = db.query(ChiTietHoaDon).filter(ChiTietHoaDon.hoa_don_id == hoadon_id).all()
#     if not chitiet_list:
#         raise HTTPException(status_code=404, detail="Không tìm thấy chi tiết hóa đơn nào.")
#     chitiet_display_list = []