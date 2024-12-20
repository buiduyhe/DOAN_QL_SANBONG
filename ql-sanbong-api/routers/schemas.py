from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Union

from datetime import time as Time ,date

class UserBase(BaseModel):
    username:str
    email:str
    password:str
    
class UserDisplay(BaseModel):
    username: str
    email: str
    class Config():
        orm_mode = True
        
class PostBase(BaseModel):
    image_url:str
    image_url_type:str
    caption:str
    creator_id:int


# For PostDisplay
class User(BaseModel):
    username:str
    class Config():
        orm_mode =True

#for postdisplay
class Comment(BaseModel):
    text:str
    username:str
    timestamp: datetime
    
    
class PostDisplay(BaseModel):
    id:int
    image_url:str
    image_url_type:str
    caption:str
    timestamp:datetime
    user: User
    comments : List[Comment]
    class Config():
        orm_mode = True
        
class UserAuth(BaseModel):
    id:int
    username: str
    email:str
    
class DichVuDisplay(BaseModel):
    id:int
    ten_dv:str
    gia_dv:int
    soluong:int
    mota:str
    image_dv:str
    class Config:
        orm_mode = True
class CommentBase(BaseModel):
    username : str
    text : str
    post_id : int

class LoginRequest(BaseModel):
    email: str
    password: str

class CreateUserDTO(BaseModel):
    fullname: str 
    email: str 
    phone: str 
    hashed_password: str | None
    gender: str
class UserRoleResponse(BaseModel):
    id : int
    name : str
    description : Optional[str] = None
    class Config:
        from_attributes = True
class UserResponseModel(BaseModel):
    id: int
    phone: Optional[str]
    email: str
    full_name: Optional[str]
    status: Optional[int]
    roles: List[UserRoleResponse] | None # List of role of the user in the system
    class Config:
        from_attributes = True
        
class LoaiDichVuDisplay(BaseModel):
    id:int
    ten_loai_dv:str
    image_dv:str

class DichVuResponse(BaseModel):
    loaidichvu_id:int
    dichvu:List[DichVuDisplay]
    class Config():
        orm_mode = True
        
class UserResponse(BaseModel):
    id: int
    phone: Optional[str]
    email: str
    full_name: Optional[str]
    status: Optional[int]
    gender: Optional[str]
    class Config:
        orm_mode = True

class TimeSlotResponse(BaseModel):
    start_time: Time
    end_time: Time
    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
class DatSanRequest(BaseModel):
    user_id: int
    san_id: str
    timeslot_id: int
    gia : int

# Response schema
class DatSanResponse(BaseModel):
    id: int
    user_id: int
    timeslot_id: int
    create_at: str

    class Config:
        orm_mode = True
        
class TimeSlotRequest(BaseModel):
    san_id: Optional[str] = None
    ngay_dat: Optional[date] = None
    batdau: Optional[Time] = None
    
class TimeSlotDisplay(BaseModel):
    id: int
    san_id: str
    ngay: date
    batdau: Time
    ketthuc: Time
    tinhtrang: bool
    class Config:
        orm_mode = True
        
class SanAvailableResponse(BaseModel):
    id: int
    san_id: str
    ngay: date
    batdau: Time
    ketthuc: Time
    tinhtrang: bool
    class Config:
        orm_mode = True
        
class DichVuDisplayQL(BaseModel):
    id:int
    ten_dv:str
    gia_dv:int
    soluong:int
    mota:str
    loai_dv_id:int
    ten_loai_dv:str
    image_dv:str
    
    class Config:
        orm_mode = True
        
class HoaDonDisplay(BaseModel):
    STT:int
    id: int
    ma_hoa_don: str
    id_nguoi_dat:int
    ten_nguoi_dat:str
    ngay_tao: datetime
    tongtien:float
    trangthai:int
    class Config:
        orm_mode = True
        
class DatDichVuRequest(BaseModel):
    dichvu_id: int
    soluong: int

class DichVuBase(BaseModel):
    id: int
    ten_dv: str
    gia_dv: int
    mota: str
    soluong: int
    image_dv: str

class DatSanBase(BaseModel):
    id: int
    gia: int
    user_id: int
    timeslot_id: int
    created_at: datetime

class ChiTietHoaDonDisplay(BaseModel):
    stt: int
    dich_vu: Union[DichVuBase, DatSanBase]

    class Config:
        orm_mode = True
        
        
class UserRequest(BaseModel):
    hoten: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    gender: Optional[str] = None
    
class SanBongUpdateRequest(BaseModel):
    gia: Optional[int] = None
    class Config:
        orm_mode = True
        
class ChitietNhapHang(BaseModel):
    id_dv:str
    soluong:int
    don_gia:int
    class Config:
        orm_mode = True
        
class ChitietNhapHangResponse(BaseModel):
    STT:int
    id_dv:int
    soluong:int
    don_gia:int
    thanhtien:int
    class Config:
        orm_mode = True
class UpdateNCC(BaseModel):
    ten_ncc: Optional[str] = None
    dia_chi: Optional[str] = None
    sdt: Optional[str] = None
    email: Optional[str] = None