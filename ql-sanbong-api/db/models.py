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
    # avatar_id = Column(Integer)
    status = Column(Integer)
    
    # Quan hệ với SysUserRole
    roles = relationship("SysUserRole", back_populates="user")
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

     # Quan hệ hai chiều với SysUser và SysRole
    user = relationship("SysUser", back_populates="roles")
    role = relationship("SysRole", back_populates="users")
# Bảng LoaiDichVu (lưu trữ loại dịch vụ)
class LoaiDichVu(Base):
    __tablename__ = 'LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_loai_dv = Column(String(255), nullable=False)
    image_dv = Column(String(255))

    # Thiết lập mối quan hệ với bảng DichVu_LoaiDichVu
    dichvus = relationship("DichVu_LoaiDichVu", back_populates="loaidichvu")


# Bảng DichVu_LoaiDichVu (liên kết giữa DichVu và LoaiDichVu)
class DichVu_LoaiDichVu(Base):
    __tablename__ = 'DICH_VU_LOAI_DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    dichvu_id = Column(Integer, ForeignKey('DICH_VU.id'))
    loaidichvu_id = Column(Integer, ForeignKey('LOAI_DICH_VU.id'))

    # Thiết lập quan hệ với bảng DichVu và LoaiDichVu
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

    # Mối quan hệ với bảng DichVu_LoaiDichVu
    loaidichvus = relationship("DichVu_LoaiDichVu", back_populates="dichvu")