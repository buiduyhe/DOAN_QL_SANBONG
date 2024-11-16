from fastapi import APIRouter , Depends,File ,HTTPException,status,UploadFile,Form
from sqlalchemy.orm import Session
from routers.schemas import DatSanRequest, DatSanResponse, DichVuResponse, LoaiDichVuDisplay, PostBase, PostDisplay,TimeSlotRequest
from db.database import get_db
from db import db_dichvu,db_user,db_san
from typing import List
import random
import string
import shutil
from routers.schemas import DichVuDisplay
import os
from db.models import DichVu, DichVu_LoaiDichVu, SysUser, TimeSlot
from db.db_user import get_current_user

router = APIRouter(
    prefix='/san',
    tags=['san']
)


@router.get("/san")
def get_all_san(db: Session = Depends(get_db)):
    san_list = db_san.get_all_san(db)
    if not san_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy sân nào.")
    return san_list
@router.get("/loai_san")
def get_all_loai_san(db: Session = Depends(get_db)):
    loai_san_list = db_san.get_all_loai_san(db)
    if not loai_san_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại sân nào.")
    return loai_san_list
@router.get("/time_slot")
def get_time_slot(db: Session = Depends(get_db)):
    time_slot_list = db_san.get_time_slot(db)
    if not time_slot_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy time slot nào.")
    return time_slot_list

@router.post("/get_id_timeslot")
def get_id_timeslot(request:TimeSlotRequest,db: Session = Depends(get_db)):
    return db_san.get_id_timeslot(request,db)