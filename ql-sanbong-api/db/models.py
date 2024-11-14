from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

# Define the SysUser model
class SysUser(Base):
    __tablename__ = 'SYS_USER'
    id = Column(Integer, primary_key=True, index=True)
    hash_password = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255))
    gender = Column(String(10))
    status = Column(Integer)

class SysRole(Base):
    __tablename__ = 'SYS_ROLE'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(255))

class SysUserRole(Base):
    __tablename__ = 'SYS_USER_ROLE'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('SYS_USER.id'))
    role_id = Column(Integer, ForeignKey('SYS_ROLE.id'))
    
    user = relationship("SysUser", back_populates="roles")
    role = relationship("SysRole", back_populates="users")

SysUser.roles = relationship("SysUserRole", back_populates="user")
SysRole.users = relationship("SysUserRole", back_populates="role")

class LoaiDichVu(Base):
    __tablename__ = 'LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_loai_dv = Column(String(255), nullable=False)
    image_dv = Column(String(255))
    
    dichvus = relationship("DichVu_LoaiDichVu", back_populates="loaidichvu")

class DichVu(Base):
    __tablename__ = 'DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_dv = Column(String(255), nullable=False)
    gia_dv = Column(Integer, nullable=False)
    soluong = Column(Integer, nullable=False)
    mota = Column(String(255), nullable=True)
    image_dv = Column(String(255))

    # Mối quan hệ với bảng DichVu_LoaiDichVu
    loaidichvus = relationship("DichVu_LoaiDichVu", back_populates="dichvu")
class DichVu_LoaiDichVu(Base):
    __tablename__ = 'DICH_VU_LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    dichvu_id = Column(Integer, ForeignKey('DICH_VU.id'))
    loaidichvu_id = Column(Integer, ForeignKey('LOAI_DICH_VU.id'))

    # Thiết lập quan hệ với bảng DichVu và LoaiDichVu
    dichvu = relationship("DichVu", back_populates="loaidichvus")
    loaidichvu = relationship("LoaiDichVu", back_populates="dichvus")
class DatSan(Base):
    __tablename__ = 'DAT_SAN'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('SYS_USER.id'), nullable=False)  # Liên kết với bảng SYS_USER
    san_id = Column(Integer, ForeignKey('SAN_BONG.id'), nullable=False)  # Liên kết với bảng SAN_BONG
    thoi_gian_bat_dau = Column(DateTime, nullable=False)  # Thời gian bắt đầu thuê
    thoi_gian_ket_thuc = Column(DateTime, nullable=False)  # Thời gian kết thúc thuê
    trang_thai = Column(Integer, nullable=False)  # Trạng thái đặt sân (1: Đã xác nhận, 0: Đang chờ, 2: Đã hủy)

class GioHoatDong(Base):
    __tablename__ = 'GIO_HOAT_DONG'
    id = Column(Integer, primary_key=True, index=True)
    ngay_trong_tuan = Column(Integer, nullable=False)
    gio_mo_cua = Column(DateTime, nullable=False)
    gio_dong_cua = Column(DateTime, nullable=False)
    
class SanBong(Base):
    __tablename__ = 'SAN_BONG'
    id = Column(Integer, primary_key=True, index=True)
    loai_san = Column(String(50), nullable=False)  # Loại sân (sân 5 hoặc sân 7)
    gia_thue = Column(Float, nullable=False)  # Giá thuê sân
    trang_thai = Column(Integer, nullable=False)  # Trạng thái sân (1: sẵn sàng, 0: không sẵn sàng)
    gio_hoat_dong_id = Column(Integer, ForeignKey('GIO_HOAT_DONG.id'), nullable=False)  # Liên kết với bảng GIO_HOAT_DONG
    # Mối quan hệ với bảng DatSan
    datsans = relationship("DatSan", back_populates="sanbong")
    # Mối quan hệ với bảng GioHoatDong
    gio_hoat_dongs = relationship("GioHoatDong", back_populates="sanbong")

DatSan.sanbong = relationship("SanBong", back_populates="datsans")
GioHoatDong.sanbong = relationship("SanBong", back_populates="gio_hoat_dongs")

class HoaDon(Base):
    __tablename__ = 'HOA_DON'
    id = Column(Integer, primary_key=True, index=True)
    ma_hoa_don = Column(String(255), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey('SYS_USER.id'), nullable=False)  # Người tạo hóa đơn
    nguoi_dat_san_id = Column(Integer, ForeignKey('SYS_USER.id'), nullable=False)  # Người đặt sân
    ngay_tao = Column(DateTime, default=func.now())
    trang_thai = Column(Integer, nullable=False, default=0)  # 0: Chưa thanh toán, 1: Đã thanh toán
    tong_tien = Column(Float, nullable=False)
    hinh_thuc_thanh_toan = Column(String(255), nullable=True)

    # Mối quan hệ với bảng ChiTietHoaDon
    chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="hoa_don")

class ChiTietHoaDon(Base):
    __tablename__ = 'CHI_TIET_HOA_DON'
    id = Column(Integer, primary_key=True, index=True)
    hoa_don_id = Column(Integer, ForeignKey('HOA_DON.id'), nullable=False)
    dat_san_dich_vu_id = Column(Integer, ForeignKey('DAT_SAN_DICH_VU.id'), nullable=False)
    so_luong = Column(Integer, nullable=False)
    gia = Column(Float, nullable=False)
    thanh_tien = Column(Float, nullable=False)

    # Mối quan hệ với bảng HoaDon
    hoa_don = relationship("HoaDon", back_populates="chi_tiet_hoa_dons")

class DatSanDichVu(Base):
    __tablename__ = 'DAT_SAN_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    dat_san_id = Column(Integer, ForeignKey('DAT_SAN.id'), nullable=False)
    dich_vu_id = Column(Integer, ForeignKey('DICH_VU.id'), nullable=False)
    so_luong = Column(Integer, nullable=False)

    # Mối quan hệ với bảng DatSan và DichVu
    dat_san = relationship("DatSan", back_populates="dat_san_dich_vus")
    dich_vu = relationship("DichVu", back_populates="dat_san_dich_vus")

DatSan.dat_san_dich_vus = relationship("DatSanDichVu", back_populates="dat_san")
DichVu.dat_san_dich_vus = relationship("DatSanDichVu", back_populates="dich_vu")




