from routers.schemas import PostBase, TimeSlotDisplay,TimeSlotResponse
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DatSan, DichVu, DichVu_LoaiDichVu, SanBong,LoaiSanBong, TimeSlot



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
    time_slot.is_available = False
    db.commit()
    return create_dat_san(db, request)

def create_dat_san(db, request):
    new_dat_san = DatSan(
        user_id=request.user_id,
        timeslot_id=request.timeslot_id,
        gia=request.gia
    )
    db.add(new_dat_san)
    db.commit()
    return {"detail": "Đặt sân thành công."}