from fastapi import APIRouter ,Depends
from sqlalchemy.orm.session import Session
from routers.schemas import  UserDisplay,UserBase
from db.database import get_db
from db import db_user
from db.models import SysUser
from routers import schemas

router = APIRouter(
    prefix="/user",
    tags=['user']
)

@router.get('/my-profile')
async def my_profile(
    db: Session = Depends(get_db), 
    current_user: SysUser = Depends(db_user.get_current_user_info)
):
    my_profile = await db_user.get_user_information(db=db, user_id=current_user.id)
    return my_profile

@router.get('/get_SysUser/{role_id}')
async def get_SysUser(
    role_id: int,
    db: Session = Depends(get_db)
):
    user_roles = await db_user.get_SysUser(db=db, role_id=role_id)
    user_responses = []
    for user_role in user_roles:
        user_responses.append(schemas.UserResponse(
            id=user_role.id,
            phone=user_role.phone,
            email=user_role.email,
            full_name=user_role.full_name,
            status=user_role.status,
            gender=user_role.gender
        ))
    return user_responses

@router.delete('/delete_SysUser/{user_id}')
def delete_SysUser(
    user_id: int,
    db: Session = Depends(get_db)
):
    return  db_user.delete_SysUser(db=db, user_id=user_id)