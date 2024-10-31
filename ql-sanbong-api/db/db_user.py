from  routers.schemas  import UserBase,CreateUserDTO
from sqlalchemy.orm.session import Session
from db.hashing import Hash
from fastapi import HTTPException, status
from db.models import SysUser
from typing import Any, Optional





def get_user_by_email(db: Session, email: str):
    return db.query(SysUser).filter(SysUser.email == email).first()

def check_active_user(
    db:Session, 
    email: Optional[str] = None, 
    user_status: Optional[int] = None)->SysUser:
    
    user = get_user_by_email(db=db, email=email)

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f'User with username {user} not found')
            
    if user.status is not user_status:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'User with username {user} is not active')
    if user.status != 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'User with username {user} is not active')
    
    return user

def create_user( db: Session, userDTO: CreateUserDTO):
    try:
        new_user = SysUser(
            full_name=userDTO.fullname, 
            email=userDTO.email, 
            phone=userDTO.phone, 
            hash_password=userDTO.hashed_password, 
            status=1,
            avatar_id=userDTO.avatar_id,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        print(f"[error][db_user][create]: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, 
            detail="lỗi tạo tài khoản"  # Replace with appropriate error message
        )