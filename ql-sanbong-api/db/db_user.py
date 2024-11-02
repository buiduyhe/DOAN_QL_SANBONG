from  routers.schemas  import UserBase,CreateUserDTO
from sqlalchemy.orm.session import Session
from db.hashing import Hash
from fastapi import HTTPException, status,Depends,Security
from db.models import SysUser ,SysUserRole,SysRole
from typing import Any, Optional
from db.database import get_db
from auth.oauth2 import SECRET_KEY,ALGORITHM
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from routers.schemas import UserResponseModel ,UserRoleResponse

oauth2_scheme_access = OAuth2PasswordBearer(tokenUrl="login")




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
            status=1
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
async def get_current_user(
    access_token: str =Depends(oauth2_scheme_access),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user = get_user_by_email(db=db, email=email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"  
            )
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate the credentials",
        )
        
        
async def get_current_user_info(
    access_token: str = Security(oauth2_scheme_access),
    db: Session = Depends(get_db)
):
    return await get_current_user(access_token=access_token, db=db)

async def get_user_information(db: Session, user_id: int) :
    user = db.query(SysUser).filter(SysUser.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_roles = (
        db.query(SysRole)
        .join(SysUserRole, SysRole.id == SysUserRole.role_id)
        .filter(SysUserRole.user_id == user_id)
        .all()
    )
    
    # Convert SysRole instances to UserRoleResponse instances
    roles = [UserRoleResponse.from_orm(role) for role in user_roles]
    
    return UserResponseModel(
        id=user.id,
        phone=user.phone,
        email=user.email,
        full_name=user.full_name,
        status=user.status,
        roles=roles
    )