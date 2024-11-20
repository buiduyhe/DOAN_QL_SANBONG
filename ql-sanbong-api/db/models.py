from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Date, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base
from sqlalchemy import Time

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
    chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="dich_vu") 
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
    timeslot_id = Column(Integer, ForeignKey('TIME_SLOT.id'), nullable=False)  # Liên kết với bảng TIME_SLOT
    gia = Column(Integer, nullable=False)  # Giá đặt sân
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Thiết lập quan hệ với bảng TimeSlot
    timeslot = relationship("TimeSlot", back_populates="datsans")
    # Thiết lập quan hệ với bảng ChiTietHoaDon
    chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="dat_san")
class TimeSlot(Base):
    __tablename__ = 'TIME_SLOT'
    id = Column(Integer, primary_key=True, index=True)
    san_id = Column(String, ForeignKey('SAN_BONG.id'), nullable=False)  # Liên kết với sân
    date = Column(Date, nullable=False)  # Ngày cụ thể
    start_time = Column(Time, nullable=False)  # Thời gian bắt đầu (chỉ giờ phút)
    end_time = Column(Time, nullable=False)  # Thời gian kết thúc (chỉ giờ phút)
    is_available = Column(Boolean, default=True)  # Đánh dấu nếu khung giờ này trống

    # Thiết lập quan hệ với bảng SanBong
    san = relationship("SanBong", back_populates="time_slots")
    
    # Thiết lập quan hệ với bảng DatSan
    datsans = relationship("DatSan", back_populates="timeslot")

class SanBong(Base):
    __tablename__ = 'SAN_BONG'
    id = Column(String, primary_key=True, index=True)
    gia_thue = Column(Float, nullable=False)  # Giá thuê sân
    trang_thai = Column(Integer, nullable=False)  # Trạng thái sân (1: sẵn sàng, 0: không sẵn sàng)
    # Mối quan hệ với bảng TimeSlot
    time_slots = relationship("TimeSlot", back_populates="san")
    # Mối quan hệ với bảng DatSan
class LoaiSanBong(Base):
    __tablename__ = 'LOAI_SAN_BONG'
    id = Column(Integer, primary_key=True, index=True)
    ten_loai_san = Column(String(50), nullable=False)
    mo_ta = Column(String(255), nullable=True)

    # Mối quan hệ với bảng SanBong
    san_bongs = relationship("SanBong", back_populates="loai_san_bong")

SanBong.loai_san_bong = relationship("LoaiSanBong", back_populates="san_bongs")
SanBong.loai_san_id = Column(Integer, ForeignKey('LOAI_SAN_BONG.id'), nullable=False)
class HoaDon(Base):
    __tablename__ = 'HOA_DON'
    id = Column(Integer, primary_key=True, index=True)
    ma_hoa_don = Column(String(255), unique=True, nullable=False)
    # id_nv = Column(Integer, ForeignKey('SYS_USER.id'), nullable=False)  # Người tạo hóa đơn
    id_user = Column(Integer,nullable=False)  # Người đặt sân
    ngay_tao = Column(DateTime, default=func.now())
    trang_thai = Column(Integer, nullable=False, default=0)  # 0: Chưa thanh toán, 1: Đã thanh toán
    tong_tien = Column(Float, nullable=False)
    
    # Mối quan hệ với bảng ChiTietHoaDon
    chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="hoa_don")

class ChiTietHoaDon(Base):
    __tablename__ = 'CHI_TIET_HOA_DON'

    id = Column(Integer, primary_key=True, index=True)
    hoa_don_id = Column(Integer, ForeignKey('HOA_DON.id'), nullable=False)
    dat_san_id = Column(Integer, ForeignKey('DAT_SAN.id'), nullable=False)
    dich_vu_id = Column(Integer, ForeignKey('DICH_VU.id'))
    so_luong = Column(Integer, nullable=False)
    
    dat_san = relationship("DatSan", back_populates="chi_tiet_hoa_dons")
    hoa_don = relationship("HoaDon", back_populates="chi_tiet_hoa_dons")
    dich_vu = relationship("DichVu", back_populates="chi_tiet_hoa_dons")

# Thiết lập quan hệ với bảng DatSan
DatSan.chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="dat_san")

# Thiết lập quan hệ với bảng DichVu
DichVu.chi_tiet_hoa_dons = relationship("ChiTietHoaDon", back_populates="dich_vu")

# Sửa lại mối quan hệ trong bảng ChiTietHoaDon
ChiTietHoaDon.dich_vu = relationship("DichVu", back_populates="chi_tiet_hoa_dons")