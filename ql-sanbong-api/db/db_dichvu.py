from routers.schemas import PostBase
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import DichVu
from routers.schemas import DichVuDisplay



def get_all_dichvu(db: Session):
    return db.query(DichVu).all()

def create_dichvu(db: Session, ten_dv: str, gia_dv: str, soluong: int, image_url: str = None):
    db_dichvu = DichVu(
        ten_dv=ten_dv,
        gia_dv=gia_dv,
        soluong=soluong,
        image_dv=image_url
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