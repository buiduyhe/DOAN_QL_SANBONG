from routers.schemas import PostBase
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DichVu, DichVu_LoaiDichVu, LoaiDichVu
from routers.schemas import DichVuDisplay



def get_all_dichvu(db: Session):
    return db.query(DichVu).all()

def create_dichvu(db: Session, ten_dv: str, gia_dv: str, soluong: int, image_url: str = None,mota: str = None):
    db_dichvu = DichVu(
        ten_dv=ten_dv,
        gia_dv=gia_dv,
        soluong=soluong,
        image_dv=image_url,
        mota=mota
    )
    db.add(db_dichvu)
    db.commit()
    db.refresh(db_dichvu)
    return db_dichvu

def delete(db: Session, id: int):
    db_dichvu = db.query(DichVu).filter(DichVu.id == id).first()
    if db_dichvu is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Dịch vụ với id {id} không tồn tại.')
    db.delete(db_dichvu)
    db.commit()
    return {"message": "Xóa dịch vụ thành công."}

def get_all_loaidichvu(db: Session):
    return db.query(LoaiDichVu).all()

def create_loaidichvu(db: Session, ten_loai_dv: str, image_url: str = None):
    db_loaidichvu = LoaiDichVu(
        ten_loai_dv=ten_loai_dv,
        image_dv=image_url
    )
    db.add(db_loaidichvu)
    db.commit()
    db.refresh(db_loaidichvu)
    return db_loaidichvu

def add_dichvu_to_loaidichvu(db: Session, dichvu_id: int, loaidichvu_id: int):
    dichvu_loaidichvu = DichVu_LoaiDichVu(
            dichvu_id=dichvu_id,
            loaidichvu_id=loaidichvu_id
        )
    db.add(dichvu_loaidichvu)
    db.commit()
    return dichvu_loaidichvu
def get_dichvu_by_name(db: Session, ten_dv: str):
    return db.query(DichVu).filter(DichVu.ten_dv == ten_dv).first()

def get_all_dichvu_ql(db: Session):
    query = db.query(DichVu, LoaiDichVu).join(DichVu_LoaiDichVu, DichVu_LoaiDichVu.dichvu_id == DichVu.id).join(LoaiDichVu, DichVu_LoaiDichVu.loaidichvu_id == LoaiDichVu.id).all()
    return query