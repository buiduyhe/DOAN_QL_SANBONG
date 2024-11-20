import random
import string
from routers.schemas import ChiTietHoaDonDisplay, DatDichVuRequest, PostBase
from sqlalchemy.orm.session import Session
import datetime
from fastapi import HTTPException, status
from db.models import ChiTietHoaDon, DatSan, DichVu, DichVu_LoaiDichVu, HoaDon, LoaiDichVu, SanBong, TimeSlot
from routers.schemas import DichVuDisplay
from typing import List, Union
from pydantic import BaseModel



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

def dat_dv_By_HoaDon(db: Session, hoa_don_id: int, request: list[DatDichVuRequest]):
    new_ct_hoadon_list = []
    for item in request:
        dichvu = db.query(DichVu).filter(DichVu.id == item.dichvu_id).first()
        if not dichvu:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy dịch vụ với id {item.dichvu_id}.")
        new_ct_hoadon = ChiTietHoaDon(
            hoa_don_id=hoa_don_id,
            dich_vu_id=item.dichvu_id,
            so_luong=item.soluong
        )
        db.add(new_ct_hoadon)
        new_ct_hoadon_list.append(new_ct_hoadon)
        db.flush()
        
    gia = get_chi_tiet_hoa_don(db, hoa_don_id)
    tong_tien = sum(item['tong_tien'] for item in gia)
    hoadon = db.query(HoaDon).filter(HoaDon.id == hoa_don_id).first()
    if not hoadon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy hóa đơn với id {hoa_don_id}.")
    hoadon.tong_tien = tong_tien
    db.commit()
    
    return {"message": "Đặt dịch vụ thành công."}

def get_chi_tiet_hoa_don(db: Session, hoa_don_id: int):
    # Query đặt sân
    dat_san_items = db.query(ChiTietHoaDon, DatSan
                            ).join(DatSan, ChiTietHoaDon.dat_san_id == DatSan.id, isouter=True
                            ).filter(ChiTietHoaDon.hoa_don_id == hoa_don_id).all()
    
    # Query dịch vụ
    dich_vu_items = db.query(ChiTietHoaDon, DichVu
                            ).join(DichVu, ChiTietHoaDon.dich_vu_id == DichVu.id, isouter=True
                            ).filter(ChiTietHoaDon.hoa_don_id == hoa_don_id).all()
    
    # Kết quả
    chi_tiet_result = []
    stt = 1  # Bắt đầu từ số thứ tự 1

    # Xử lý danh sách đặt sân
    for ct, ds in dat_san_items:
        if ds:  # Chỉ thêm vào nếu đặt sân tồn tại
            chi_tiet_result.append({
                "stt": stt,
                "ten_san_pham": f"Đặt sân {ds.id_san}",
                "so_luong": ct.so_luong,
                "don_gia": ds.gia,
                "tong_tien": ct.so_luong * ds.gia if ds.gia else 0
            })
            stt += 1

    # Xử lý danh sách dịch vụ
    for ct, dv in dich_vu_items:
        if dv:  # Chỉ thêm vào nếu dịch vụ tồn tại
            chi_tiet_result.append({
                "stt": stt,
                "ten_san_pham": dv.ten_dv,
                "so_luong": ct.so_luong,
                "don_gia": dv.gia_dv,
                "tong_tien": ct.so_luong * dv.gia_dv if dv.gia_dv else 0
            })
            stt += 1

    return chi_tiet_result



def dat_dv(db:Session,request: list[DatDichVuRequest],user_id:int):
    try:
        new_ct_hoadon_list = []
        new_hoadon = HoaDon(
                ma_hoa_don = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
                id_user = user_id,
                ngay_tao = datetime.datetime.now(),
                trang_thai = 0,##chưa thanh toán
                tong_tien = 0
            ) 
        db.add(new_hoadon)
        db.flush()
            
        for item in request:
            dichvu = db.query(DichVu).filter(DichVu.id == item.dichvu_id).first()
            if not dichvu:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Không tìm thấy dịch vụ với id {item.dichvu_id}.")
            
            new_ct_hoadon = ChiTietHoaDon(
                hoa_don_id=new_hoadon.id,
                dich_vu_id=item.dichvu_id,
                so_luong=item.soluong
            )
            db.add(new_ct_hoadon)
            new_ct_hoadon_list.append(new_ct_hoadon)
            db.flush()
            
        gia = get_chi_tiet_hoa_don(db,new_hoadon.id)
        tong_tien = sum(item['tong_tien'] for item in gia)
        new_hoadon.tong_tien = tong_tien
            
            
        db.commit()
        return {"message": "Đặt dịch vụ thành công."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
