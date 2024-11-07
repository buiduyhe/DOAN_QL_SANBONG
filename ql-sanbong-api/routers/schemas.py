from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

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