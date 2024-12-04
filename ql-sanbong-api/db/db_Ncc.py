import locale
import os
import random
import string
from routers.schemas import HoaDonDisplay, PostBase, TimeSlotDisplay, TimeSlotRequest,TimeSlotResponse,SanBongUpdateRequest
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DatSan, DichVu, DichVu_LoaiDichVu, SanBong,LoaiSanBong, SysUser, TimeSlot,ChiTietHoaDon,HoaDon,NhaCungCap
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