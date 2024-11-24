from fastapi import APIRouter , Depends,File ,HTTPException,status,UploadFile,Form, Body
from sqlalchemy.orm import Session
from routers.schemas import ChiTietHoaDonDisplay, DatDichVuRequest, DichVuDisplayQL, DichVuResponse, LoaiDichVuDisplay, PostBase, PostDisplay
from db.database import get_db
from db import db_dichvu,db_user
from typing import List
import random
import string
import shutil
from routers.schemas import DichVuDisplay
import os
from db.models import DichVu, DichVu_LoaiDichVu, LoaiDichVu, SysUser
from db.db_user import get_current_user

router = APIRouter(
    prefix='/dichvu',
    tags=['dichvu']
)

@router.get("/dichvu_QL", response_model=List[DichVuDisplayQL])
def get_all_dichvuql(db: Session = Depends(get_db)):
    dichvu_list = db_dichvu.get_all_dichvu_ql(db)
    if not dichvu_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nào.")
    return [
        DichVuDisplayQL(
            id=dv.DichVu.id,
            ten_dv=dv.DichVu.ten_dv,
            gia_dv=dv.DichVu.gia_dv,
            soluong=dv.DichVu.soluong,
            mota=dv.DichVu.mota,
            loai_dv_id=dv.LoaiDichVu.id,
            ten_loai_dv=dv.LoaiDichVu.ten_loai_dv,
            image_dv=dv.DichVu.image_dv
        ) for dv in dichvu_list
    ]


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
    loaidichvu_id: int = Form(...),
    image: UploadFile = File(None),
    mota: str = Form(None),
    db: Session = Depends(get_db)
):
    try:
        # Kiểm tra xem tên dịch vụ đã tồn tại chưa
        existing_dichvu = db_dichvu.get_dichvu_by_name(db, ten_dv)
        if existing_dichvu:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Tên dịch vụ đã tồn tại.")
        
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
        get_dv = db_dichvu.create_dichvu(db, ten_dv, gia_dv, soluong, image_url,mota)
        db_dichvu.add_dichvu_to_loaidichvu(db, get_dv.id, loaidichvu_id)
        return {"message": "Tạo dịch vụ thành công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dịch vụ: {str(e)}")



@router.delete('/delete/{id}')
def delete(
    id : int, 
    db:Session =Depends(get_db)
):
    return db_dichvu.delete(db,id)

    
@router.post("/loaidichvu")
def create_loaidichvu(
    ten_loai_dv: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
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
        db_dichvu.create_loaidichvu(db, ten_loai_dv, image_url)
        return {"message": "Tạo loại dịch vụ thành công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi tạo dịch vụ: {str(e)}")
    
@router.get("/loaidichvu", response_model=list[LoaiDichVuDisplay])
def get_all_loaidichvu(db: Session = Depends(get_db)):
    dichvu_list = db_dichvu.get_all_loaidichvu(db)
    if not dichvu_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy dịch vụ nào.")
    return dichvu_list

@router.get("/dichvu/{loaidichvu_id}", response_model=DichVuResponse)
def get_services_by_type(loaidichvu_id: int, db: Session = Depends(get_db)):
    dichvu_ids = db.query(DichVu_LoaiDichVu.dichvu_id).filter(DichVu_LoaiDichVu.loaidichvu_id == loaidichvu_id).all()

    if not dichvu_ids:
        raise HTTPException(status_code=404, detail="No services found for the given category")

    dichvu_ids = [item[0] for item in dichvu_ids]  # Flattening the list of tuples to a list of IDs

    services = db.query(DichVu).filter(DichVu.id.in_(dichvu_ids)).all()

    if not services:
        raise HTTPException(status_code=404, detail="No services found for the given IDs")

    # Step 4: Prepare and return the response with service details
    dichvu_response = DichVuResponse(
        loaidichvu_id=loaidichvu_id,
        dichvu=[DichVuDisplay(
            id=s.id,
            ten_dv=s.ten_dv,
            gia_dv=s.gia_dv,
            soluong=s.soluong,
            mota=s.mota,
            image_dv=s.image_dv
        ) for s in services]
    )

    return dichvu_response

@router.post('/dat_dv_By_HoaDon/{hoadon_id}')
def dat_dv_By_HoaDon(
    hoadon_id: int,
    request: List[DatDichVuRequest],
    db: Session = Depends(get_db)
):
    return db_dichvu.dat_dv_By_HoaDon(db=db, hoa_don_id=hoadon_id, request=request)
@router.post('/dat_dv')
def dat_dv(
    request: List[DatDichVuRequest],
    db: Session = Depends(get_db),
    current_user: SysUser = Depends(db_user.get_current_user_info)

):
    return db_dichvu.dat_dv(db=db, request=request,user_id=current_user.id)
@router.get('/get_chi_tiet_hoadon/{hoadon_id}')
def get_chi_tiet_hoadon(hoadon_id: int, db: Session = Depends(get_db)):
    chi_tiet_hoa_don = db_dichvu.get_chi_tiet_hoa_don(db, hoa_don_id=hoadon_id)
    return chi_tiet_hoa_don

@router.delete('/delete_dv')
def delete_dv(
    ids: List[int] = Body(...),
    db: Session = Depends(get_db)
):
    try:
        for id in ids:
            db_dichvu.delete_dv(db, id)
        return {"message": "Xóa các dịch vụ thành công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa dịch vụ: {str(e)}")
    
    