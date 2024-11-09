# models.py
from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from db.database import Base
from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String,  DateTime
from sqlalchemy.sql import func


class SysUser(Base):
    __tablename__ = 'SYS_USER'
    id = Column(Integer, primary_key=True, index=True)
    hash_password = Column(String(255))
    phone = Column(String(20))
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255))
    status = Column(Integer)
    
    # Quan hệ với bảng SYS_USER_ROLE
    roles = relationship("SysUserRole", back_populates="user")
    # Quan hệ với bảng HOA_DON (người tạo và người đặt sân)
    hoa_dons_tao = relationship("HoaDon", foreign_keys="HoaDon.user_id", back_populates="user")
    hoa_dons_dat = relationship("HoaDon", foreign_keys="HoaDon.nguoi_dat_san_id", back_populates="nguoi_dat_san")
class SysRole(Base):
    __tablename__ = 'SYS_ROLE'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(String(255))
    
    # Quan hệ với SysUserRole
    users = relationship("SysUserRole", back_populates="role")
class SysUserRole(Base):
    __tablename__ = 'SYS_USER_ROLE'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('SYS_USER.id'))
    role_id = Column(Integer, ForeignKey('SYS_ROLE.id'))
    user = relationship("SysUser", back_populates="roles")
    role = relationship("SysRole", back_populates="users")
    
    
# Bảng LoaiDichVu (lưu trữ loại dịch vụ)
class LoaiDichVu(Base):
    __tablename__ = 'LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_loai_dv = Column(String(255), nullable=False)
    image_dv = Column(String(255))

    # Mối quan hệ với bảng DICH_VU_LOAI_DICH_VU
    dichvus = relationship("DichVu_LoaiDichVu", back_populates="loaidichvu")


# Bảng DichVu_LoaiDichVu (liên kết giữa DichVu và LoaiDichVu)
class DichVu_LoaiDichVu(Base):
    __tablename__ = 'DICH_VU_LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    dichvu_id = Column(Integer, ForeignKey('DICH_VU.id'))
    loaidichvu_id = Column(Integer, ForeignKey('LOAI_DICH_VU.id'))

    # Quan hệ với bảng DICH_VU và LOAI_DICH_VU
    dichvu = relationship("DichVu", back_populates="loaidichvus")
    loaidichvu = relationship("LoaiDichVu", back_populates="dichvus")


# Cập nhật bảng DichVu để tạo mối quan hệ nhiều-nhiều với LoaiDichVu
class DichVu(Base):
    __tablename__ = 'DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_dv = Column(String(255), nullable=False)
    gia_dv = Column(Integer, nullable=False)
    soluong = Column(Integer, nullable=False)
    mota = Column(String(255), nullable=True)
    image_dv = Column(String(255))

    # Quan hệ với bảng DICH_VU_LOAI_DICH_VU
    loaidichvus = relationship("DichVu_LoaiDichVu", back_populates="dichvu")


class DatSan(Base):
    __tablename__ = 'DAT_SAN'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('SYS_USER.id'), nullable=False)  # Liên kết với bảng SYS_USER
    san_id = Column(Integer, ForeignKey('SAN_BONG.id'), nullable=False)  # Liên kết với bảng SAN_BONG
    thoi_gian_bat_dau = Column(DateTime, nullable=False)  # Thời gian bắt đầu thuê
    thoi_gian_ket_thuc = Column(DateTime, nullable=False)  # Thời gian kết thúc thuê
    trang_thai = Column(Integer, nullable=False)  # Trạng thái đặt sân (1: Đã xác nhận, 0: Đang chờ, 2: Đã hủy)
    
    # Quan hệ với bảng SysUser và SanBong
    user = relationship("SysUser", back_populates="dat_sans")
    san = relationship("SanBong", back_populates="dat_sans")


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
    
    # Quan hệ với SysUser (người tạo và người đặt sân)
    user = relationship("SysUser", foreign_keys=[user_id], back_populates="hoa_dons_tao")
    nguoi_dat_san = relationship("SysUser", foreign_keys=[nguoi_dat_san_id], back_populates="hoa_dons_dat")

    # Quan hệ với ChiTietHoaDon
    chi_tiets = relationship("ChiTietHoaDon", back_populates="hoa_don")
    
class GioHoatDong(Base):
    __tablename__ = 'GIO_HOAT_DONG'
    id = Column(Integer, primary_key=True, index=True)
    ngay_trong_tuan = Column(Integer, nullable=False)  # Ngày trong tuần (1-7, từ thứ 2 đến Chủ nhật)
    gio_mo_cua = Column(DateTime, nullable=False)  # Giờ mở cửa
    gio_dong_cua = Column(DateTime, nullable=False)  # Giờ đóng cửa
    
    san_bongs = relationship("SanBong", back_populates="gio_hoat_dong")
    
class SanBong(Base):
    __tablename__ = 'SAN_BONG'
    id = Column(Integer, primary_key=True, index=True)
    loai_san = Column(String(50), nullable=False)  # Loại sân (sân 5 hoặc sân 7)
    gia_thue = Column(Float, nullable=False)  # Giá thuê sân
    trang_thai = Column(Integer, nullable=False)  # Trạng thái sân (1: sẵn sàng, 0: không sẵn sàng)
    gio_hoat_dong_id = Column(Integer, ForeignKey('GIO_HOAT_DONG.id'))  # Liên kết với bảng GioHoatDong
    
    # Quan hệ với bảng GioHoatDong
    gio_hoat_dong = relationship("GioHoatDong", back_populates="san_bongs")
# Quan hệ ngược lại trong bảng GioHoatDong
GioHoatDong.san_bongs = relationship("SanBong", back_populates="gio_hoat_dong")



class ChiTietHoaDon(Base):
    __tablename__ = 'CHI_TIET_HOA_DON'
    id = Column(Integer, primary_key=True, index=True)
    hoa_don_id = Column(Integer, ForeignKey('HOA_DON.id'), nullable=False)
    dat_san_dich_vu_id = Column(Integer, ForeignKey('DAT_SAN_DICH_VU.id'), nullable=False)
    so_luong = Column(Integer, nullable=False)
    gia = Column(Float, nullable=False)
    thanh_tien = Column(Float, nullable=False)

    # Quan hệ với HoaDon
    hoa_don = relationship("HoaDon", back_populates="chi_tiets")

    # Quan hệ với DatSanDichVu
    dat_san_dich_vu = relationship("DatSanDichVu", back_populates="chi_tiets")

# Quan hệ ngược lại trong bảng SysUser
SysUser.hoa_dons_tao = relationship("HoaDon", foreign_keys=[HoaDon.user_id], back_populates="user")
SysUser.hoa_dons_dat = relationship("HoaDon", foreign_keys=[HoaDon.nguoi_dat_san_id], back_populates="nguoi_dat_san")

# Quan hệ ngược lại trong bảng SanBong
SanBong.dat_sans = relationship("DatSan", back_populates="san")

class DatSanDichVu(Base):
    __tablename__ = 'DAT_SAN_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    dat_san_id = Column(Integer, ForeignKey('DAT_SAN.id'), nullable=False)  # Liên kết với bảng DAT_SAN
    dich_vu_id = Column(Integer, ForeignKey('DICH_VU.id'), nullable=False)  # Liên kết với bảng DICH_VU
    so_luong = Column(Integer, nullable=False)  # Số lượng dịch vụ hoặc sân đã đặt

    # Quan hệ với bảng DatSan và DichVu
    dat_san = relationship("DatSan", back_populates="dich_vus")
    dich_vu = relationship("DichVu", back_populates="dat_san_dich_vus")

# Quan hệ ngược lại trong bảng DatSan
DatSan.dich_vus = relationship("DatSanDichVu", back_populates="dat_san")

# Quan hệ ngược lại trong bảng DichVu
DichVu.dat_san_dich_vus = relationship("DatSanDichVu", back_populates="dich_vu")

