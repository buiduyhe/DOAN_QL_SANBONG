from fastapi import APIRouter ,Depends
from sqlalchemy.orm.session import Session
from routers.schemas import  UserDisplay,UserBase
from db.database import get_db
from db import db_user
from db.models import SysUser

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