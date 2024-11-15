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
    time_slots = db.query(TimeSlot).distinct(TimeSlot.start_time, TimeSlot.end_time).all()
    unique_slots = []
    seen_slots = set()
    for slot in time_slots:
        if (slot.start_time, slot.end_time) not in seen_slots:
            seen_slots.add((slot.start_time, slot.end_time))
            unique_slots.append(TimeSlotResponse(start_time=slot.start_time, end_time=slot.end_time))
    return unique_slots
