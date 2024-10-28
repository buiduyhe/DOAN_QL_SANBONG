import random
import string
from  routers.schemas  import UserBase
from sqlalchemy.orm.session import Session
from db.hashing import Hash
from fastapi import HTTPException, status
from db.models import SysUser
from typing import Any, Optional
import re


async def check_phone_number_valid(phone: str):
    # Define regex for phone number validation
    phone_regex = r'^\+?[0-9]{10,15}$'
    
    # Check if the phone number matches the regex pattern
    if not re.match(phone_regex, phone):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Định dạng số điện thoại không hợp lệ. Phải bắt đầu với dấu + và chứa từ 10 đến 15 chữ số')
            
    # Remove the "+" sign from the phone number if it exists
    sanitized_phone = phone.replace("+", "")

    return sanitized_phone


def generate_password():
    # Define the character sets
    letters_and_digits = string.ascii_letters + string.digits
    special_characters = "!@#*"

    # Ensure at least one special character is included
    password = [random.choice(special_characters)]

    # Generate the remaining characters
    password += random.choices(letters_and_digits + special_characters, k=7)

    # Shuffle to avoid predictable patterns
    random.shuffle(password)

    return "".join(password)
