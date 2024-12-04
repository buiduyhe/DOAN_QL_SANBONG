from fastapi import APIRouter , Depends,File ,HTTPException,status,UploadFile,Form
from sqlalchemy.orm import Session
from db.database import get_db
from db import db_dichvu,db_user,db_san,db_Ncc,db_auth
from typing import List
import random
from db.models import DichVu, NhaCungCap, NhapHang, ChiTietNhapHang
from routers.schemas import ChitietNhapHang, ChitietNhapHangResponse, UpdateNCC
router = APIRouter(
    prefix='/Ncc',
    tags=['Ncc']
)

@router.get("/Ncc")
def get_all_Ncc(db: Session = Depends(get_db)):
    Ncc_list = db_Ncc.get_all_Ncc(db)
    if not Ncc_list:
        raise HTTPException(status_code=404, detail="Không tìm thấy Ncc nào.")
    return Ncc_list

@router.post("/create-Ncc")
async def create_Ncc(
    tenNcc: str = Form(...),
    diachi: str = Form(...),
    sdt: str = Form(...),
    email: str = Form(...),
    db: Session = Depends(get_db)
):
    query = db_Ncc.get_Ncc_by_name(db, tenNcc)
    if query:
        raise HTTPException(status_code=400, detail="Nhà cung cấp đã tồn tại.")
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Email không đúng định dạng.")
    sdt = await db_auth.check_phone_number_valid(phone=sdt)
    
    return db_Ncc.create_Ncc(db=db, tenNcc=tenNcc, diachi=diachi, sdt=sdt,email=email)
@router.get("/get-Ncc/{id}")
def get_Ncc_by_id(id: int, db: Session = Depends(get_db)):
    query = db_Ncc.get_Ncc_by_id(db, id)
    if not query:
        raise HTTPException(status_code=404, detail="Không tìm thấy Nhà cung cấp.")
    return query
@router.put("/update-Ncc/{id}")
def update_Ncc(
    id: int,
    Ncc: UpdateNCC,
    db: Session = Depends(get_db)
):
    query = db_Ncc.get_Ncc_by_id(db, id)
    if not query:
        raise HTTPException(status_code=404, detail="Không tìm thấy Nhà cung cấp.")
    
    return db_Ncc.update_Ncc(db=db, id=id,Ncc=Ncc)

@router.delete("/delete-Ncc/{id}")
def delete_Ncc(id: int, db: Session = Depends(get_db)):
    query = db_Ncc.get_Ncc_by_id(db, id)
    if not query:
        raise HTTPException(status_code=404, detail="Không tìm thấy Nhà cung cấp.")
    db.delete(query)
    db.commit()
    return {"message": "Xóa Nhà cung cấp thành công."}

@router.post("/nhap-hang/")
def them_phieu_nhap(
    ncc_id: int, 
    chi_tiet: List[ChitietNhapHang], 
    db: Session = Depends(get_db)
):
    tong_tien = sum(item.soluong * item.don_gia for item in chi_tiet)
    phieu_nhap = NhapHang(
        ma_phieu_nhap="PN" + str(random.randint(1000, 9999)),
        ncc_id=ncc_id, 
        tong_tien=tong_tien,
        trang_thai=0,
        )
    
    db.add(phieu_nhap)
    db.flush()

    for item in chi_tiet:
        chi_tiet_nhap = ChiTietNhapHang(
            nhap_hang_id=phieu_nhap.id,
            dich_vu_id=item.id_dv,
            so_luong=item.soluong,
            don_gia=item.don_gia,
            thanh_tien=item.soluong * item.don_gia
        )
        db.add(chi_tiet_nhap)
    db.commit()
    return {"message": "Thêm phiếu nhập thành công"}

@router.get("/get-all-nhap-hang")
def get_all_nhap_hang(db: Session = Depends(get_db)):
    phieu_nhap = db.query(NhapHang).all()
    if not phieu_nhap:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập nào.")
    
    return phieu_nhap

@router.get("/chi-tiet-nhap-hang/{nhap_hang_id}")
def chi_tiet_phieu_nhap(nhap_hang_id: int, db: Session = Depends(get_db)):
    phieu_nhap = db.query(NhapHang).filter(NhapHang.id == nhap_hang_id).first()
    if not phieu_nhap:
        raise HTTPException(status_code=404, detail="Phiếu nhập không tồn tại")
    chitiet = db.query(ChiTietNhapHang).filter(ChiTietNhapHang.nhap_hang_id == nhap_hang_id).all()
    return {
        "chi_tiet": [
            ChitietNhapHangResponse(
                STT=index + 1,
                id_dv=item.dich_vu_id,
                soluong=item.so_luong,
                don_gia=item.don_gia,
                thanhtien=item.thanh_tien
            ) for index, item in enumerate(chitiet)
        ]
    }

@router.post("/nhap-hang/{nhap_hang_id}/duyet")
def ApproveNhapHang(nhap_hang_id: int, db: Session = Depends(get_db)):
    phieu_nhap = db.query(NhapHang).filter(NhapHang.id == nhap_hang_id).first()
    if not phieu_nhap:
        raise HTTPException(status_code=404, detail="Phiếu nhập không tồn tại")
    if phieu_nhap.trang_thai == 1:
        raise HTTPException(status_code=400, detail="Phiếu nhập đã được duyệt trước đó")
    if phieu_nhap.trang_thai == 2:
        raise HTTPException(status_code=400, detail="Phiếu nhập đã bị từ chối duyệt trước đó không thể duyệt")
    phieu_nhap.trang_thai = 1
    
    chi_tiets = db.query(ChiTietNhapHang).filter(ChiTietNhapHang.nhap_hang_id == phieu_nhap.id).all()
    for chi_tiet in chi_tiets:
        dich_vu = db.query(DichVu).filter(DichVu.id == chi_tiet.dich_vu_id).first()
        if not dich_vu:
            raise HTTPException(status_code=404, detail=f"Dịch vụ ID {chi_tiet.dich_vu_id} không tồn tại")
        # Cập nhật số lượng tồn
        dich_vu.soluong += chi_tiet.so_luong
    db.commit()
    return {"message": "Duyệt phiếu nhập thành công"}
@router.post("/nhap-hang/{nhap_hang_id}/tuchoiduyet")
def RejectNhapHang(nhap_hang_id: int, db: Session = Depends(get_db)):
    phieu_nhap = db.query(NhapHang).filter(NhapHang.id == nhap_hang_id).first()
    if not phieu_nhap:
        raise HTTPException(status_code=404, detail="Phiếu nhập không tồn tại")
    if phieu_nhap.trang_thai == 1:
        raise HTTPException(status_code=400, detail="Phiếu nhập đã được duyệt trước đó không thể từ chối duyệt")
    if phieu_nhap.trang_thai == 2:
        raise HTTPException(status_code=400, detail="Phiếu nhập đã bị từ chối duyệt trước đó")
    phieu_nhap.trang_thai = 2
    db.commit()
    return {"message": "Từ chối duyệt phiếu nhập thành công"}

@router.get('/get-all-phieu-nhap')
def get_all_phieu_nhap(db: Session = Depends(get_db)):
    phieu_nhap = db.query(NhapHang).all()
    if not phieu_nhap:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu nhập nào.")
    
    return phieu_nhap