from routers.schemas import PostBase,TimeSlotResponse
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DichVu, DichVu_LoaiDichVu, SanBong,LoaiSanBong, TimeSlot



def get_all_san(db: Session):
    return db.query(SanBong).all()

def get_all_loai_san(db: Session):
    return db.query(LoaiSanBong).all()

def get_time_slot(db: Session):
    time_slots = db.query(TimeSlot).distinct(TimeSlot.start_time, TimeSlot.end_time, TimeSlot.is_available).all()
    unique_slots = []
    seen_slots = set()
    for slot in time_slots:
        if (slot.start_time, slot.end_time, slot.is_available) not in seen_slots:
            seen_slots.add((slot.start_time, slot.end_time, slot.is_available))
            unique_slots.append(TimeSlotResponse(start_time=slot.start_time, end_time=slot.end_time, tinhtrang=slot.is_available))
    return unique_slots

def get_id_timeslot(request,db: Session):
    time_slot = db.query(TimeSlot).filter(TimeSlot.san_id == request.san_id, TimeSlot.date == request.ngay_dat,TimeSlot.start_time == request.batdau).first()
    if not time_slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy time slot.")
    return {"id": time_slot.id}
