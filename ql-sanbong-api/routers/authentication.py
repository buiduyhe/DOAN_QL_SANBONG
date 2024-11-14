from fastapi import APIRouter,Depends,HTTPException,Form, status,BackgroundTasks,File,UploadFile
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from db.database import get_db
from sqlalchemy.orm.session import Session
from db.hashing import Hash
from db import models,db_user,db_auth
from routers.schemas import LoginRequest, CreateUserDTO
import bcrypt
from typing import Optional
from datetime import datetime



from auth.oauth2 import create_access_token


router = APIRouter(
    tags=['authentication']
)

# @router.post("/login") #convert multiple languages DONE
# async def login(
#     request: LoginRequest,
#     db: Session = Depends(get_db),
# ):
#     email = request.email.lower()
#     user_status =  db_user.get_user_by_email(db=db, email=email)
    
    
#     user = db_user.check_active_user(
#         db=db, 
#         email=email,
#         user_status= user_status.status
#     )

#     # if  user.hash_password and Hash.verify(request.password, user.hash_password): này bản gốc sau này dùng 
#     if  user.hash_password :
        
#         access_token = create_access_token(data={"sub": user.email, "fresh": True})
#         refresh_token = create_refresh_token(data={"sub": user.email})

#         return {
#             "access_token": access_token,
#             "refresh_token": refresh_token,
#         }
    
#     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=f'login failed')
@router.post('/login')
def login(request: OAuth2PasswordRequestForm =Depends(), db: Session = Depends(get_db)):
    email = request.username.lower()  # Sử dụng trường 'username' cho email
    user_status = db_user.get_user_by_email(db=db, email=email)
    
    user = db_user.check_active_user(
        db=db, 
        email=email,
        user_status=user_status.status
    )
    if not user:
          raise HTTPException(status_code=404, detail='Invalid credentials')
    
    # Kiểm tra mật khẩu (giả định đã có hàm xác thực)
    # if user.hash_password and Hash.verify(request.password, user.hash_password):
    if request.password ==  user.hash_password:
        access_token = create_access_token(data={"sub": user.email})

        return {
            "access_token": access_token
        }
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail='login failed')
@router.post('/register')
async def register( 
    background_tasks: BackgroundTasks,
    fullname: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    password: str = Form(...),
    gender: str = Form(...),
    db: Session = Depends(get_db),
):
    phone = await db_auth.check_phone_number_valid(phone=phone)
    email = email.lower()
    gender =gender.upper()

    # hashed_password = password
    # password = db_auth.generate_password()
    # hashed_password = Hash.bcrypt(password)# này bản gốc sau nay dùng
    hashed_password = password
    

    userDTO = CreateUserDTO(
        fullname=fullname,
        email=email,
        phone=phone,
        hashed_password=hashed_password,
        gender=gender
    )
    
    user = db_user.create_user(db=db, userDTO=userDTO)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="lỗi đăng kí tài khoản",  # Replace with the correct error message or variable
        )
    
    return {"detail": "Đăng kí tài khoản thành công"}  # Trả về thông báo thành công với mật khẩu
