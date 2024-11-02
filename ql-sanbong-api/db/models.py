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
# Thêm bảng DICH_VU
class DichVu(Base):
    __tablename__ = 'DICH_VU'
    id = Column(Integer, primary_key=True, index=True)
    ten_dv = Column(String(255), nullable=False)
    gia_dv = Column(Integer, nullable=False)
    soluong = Column(Integer, nullable=False)
    image_dv = Column(String(255))