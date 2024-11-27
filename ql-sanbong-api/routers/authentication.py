import os
import shutil
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
from db.models import SysUser


from auth.oauth2 import create_access_token


router = APIRouter(
    tags=['authentication']
)
DB_PATH = "sanbong_api.db"
BACKUP_DIR = "backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

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
    if user.hash_password and Hash.verify(user.hash_password, request.password):
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
    hashed_password = Hash.bcrypt(password)# này bản gốc sau nay dùng
    

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


@router.post('/register-nhanvien')
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

    hashed_password = Hash.bcrypt(password)# này bản gốc sau nay dùng

    

    userDTO = CreateUserDTO(
        fullname=fullname,
        email=email,
        phone=phone,
        hashed_password=hashed_password,
        gender=gender
    )
    
    user = db_user.create_nv(db=db, userDTO=userDTO)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="lỗi đăng kí tài khoản",  # Replace with the correct error message or variable
        )
    
    return {"detail": "Đăng kí tài khoản thành công"} 

@router.put('/change-password')
async def change_password(
    password: str = Form(...),
    new_password: str = Form(...),
    current_user: SysUser = Depends(db_user.get_current_user_info),
    db: Session = Depends(get_db),

):
    user = db_user.get_user_by_email(db=db, email=current_user.email)
    if not Hash.verify(user.hash_password, password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sai mật khẩu"
        )
    new_hashed_password = Hash.bcrypt(new_password)
    user.hash_password = new_hashed_password
    db.commit()
    return {"message": "Đổi mật khẩu thành công"}

@router.post("/backup")
async def backup_database():
    try:
        # Tạo tên file sao lưu với timestamp
        backup_file = os.path.join(BACKUP_DIR, f"backup_{datetime.now().strftime('%Y%m%d%H%M%S')}.sqlite")
        shutil.copy(DB_PATH, backup_file)
        return {"message": "Sao lưu dữ liệu thành công", "backup_file": backup_file}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")
    

@router.post("/restore-by-filename")
async def restore_database_by_filename(filename: str = Form(...)):
    try:
        # Kiểm tra định dạng file
        if not filename.endswith(".sqlite"):
            raise HTTPException(status_code=400, detail="Invalid file format. Please provide a '.sqlite' filename.")

        # Đường dẫn file sao lưu
        backup_file = os.path.join(BACKUP_DIR, filename)

        # Kiểm tra xem file có tồn tại trong thư mục backups không
        if not os.path.exists(backup_file):
            raise HTTPException(status_code=404, detail="Backup file not found in the backups directory.")

        # Phục hồi cơ sở dữ liệu
        shutil.copy(backup_file, DB_PATH)
        return {"message": "Phục Hồi Thành Công."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")
    
@router.get("/backup-files")
async def list_backup_files():
    try:
        # Kiểm tra thư mục sao lưu
        if not os.path.exists(BACKUP_DIR):
            raise HTTPException(status_code=404, detail="Backup directory does not exist.")

        # Lấy danh sách file
        files = [f for f in os.listdir(BACKUP_DIR) if os.path.isfile(os.path.join(BACKUP_DIR, f))]
        
        if not files:
            return {"message": "No backup files found.", "files": []}
        
        return {"message": "Backup files retrieved successfully.", "files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list backup files: {str(e)}")