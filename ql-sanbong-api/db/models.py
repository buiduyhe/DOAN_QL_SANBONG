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
    avatar_id = Column(Integer)
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
