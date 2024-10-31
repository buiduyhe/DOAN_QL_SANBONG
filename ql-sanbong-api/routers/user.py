from fastapi import APIRouter ,Depends
from sqlalchemy.orm.session import Session
from routers.schemas import  UserDisplay,UserBase
from db.database import get_db
from db import db_user


router = APIRouter(
    prefix="/user",
    tags=['user']
)
