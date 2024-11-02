from fastapi import APIRouter , Depends,File ,HTTPException,status,UploadFile,Form
from sqlalchemy.orm import Session
from routers.schemas import PostBase, PostDisplay
from db.database import get_db
from db import db_dichvu,db_user
from typing import List
import random
import string
import shutil
from routers.schemas import DichVuDisplay
import os
from db.models import SysUser
from db.db_user import get_current_user

router = APIRouter(
    prefix='/dichvu',
    tags=['dichvu']
)

@router.get("/dichvu", response_model=list[DichVuDisplay])
def get_all_dichvu(db: Session = Depends(get_db)):
    dichvu_list = db_dichvu.get_all_dichvu(db)
    if not dichvu_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nào.")
    return dichvu_list

@router.post("/dichvu")
def create_dichvu(
    ten_dv: str = Form(...),
    gia_dv: str = Form(...),
    soluong: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: SysUser = Depends(get_current_user)
):
    try:
        image_url = None
        if image:
            # Tạo tên tệp ngẫu nhiên để tránh trùng lặp
            letters = string.ascii_letters
            rand_str = ''.join(random.choice(letters) for i in range(6))
            new = f'_{rand_str}.'
            filename = new.join(image.filename.rsplit('.', 1))
            
            # Đường dẫn để lưu tệp ảnh
            path = f'images/{filename}'
            if not os.path.exists('images'):
                os.makedirs('images')  # Tạo thư mục nếu chưa tồn tại
            
            # Lưu tệp vào thư mục
            with open(path, "w+b") as buffer:
                shutil.copyfileobj(image.file, buffer)
            
            image_url = path  # Đường dẫn của ảnh được lưu
        db_dichvu.create_dichvu(db, ten_dv, gia_dv, soluong, image_url)
        return {"message": "Tạo dịch vụ thành công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dịch vụ: {str(e)}")



@router.delete('/delete/{id}')
def delete(
    id : int, 
    db:Session =Depends(get_db),
    current_user: SysUser = Depends(get_current_user)
    
):
    return db_dichvu.delete(db,id)

    