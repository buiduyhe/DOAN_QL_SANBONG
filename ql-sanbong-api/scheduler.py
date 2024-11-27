# scheduler.py

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta ,date
from sqlalchemy.orm import Session
from db.database import SessionLocal, get_db
from db.models import DatSan, SanBong, TimeSlot
import os
import shutil
from fastapi import HTTPException
    
# Hàm tạo khung giờ hàng ngày cho tất cả các sân
def create_time_slots_for_day(db, san_id, today):
    start_time = datetime.strptime("05:00", "%H:%M")
    end_time = datetime.strptime("23:00", "%H:%M")
    time_interval = timedelta(hours=1, minutes=30)

    while start_time.time() < end_time.time():
        slot_end_time = start_time + time_interval
        # Thêm khung giờ vào bảng TIME_SLOT
        new_slot = TimeSlot(
            san_id=san_id,
            date=today,
            start_time=start_time.time(),
            end_time=slot_end_time.time(),
            is_available=True
        )
        db.add(new_slot)
        start_time = slot_end_time

    db.commit()
    
def create_daily_time_slots():
    db: Session = next(get_db())
    try:
        today = datetime.now().date()
        sanbongs = db.query(SanBong).all()
        for i in range(0, 3):
            future_date = today + timedelta(days=i)
            for sanbong in sanbongs:
                # Kiểm tra xem khung giờ đã tồn tại cho ngày hôm nay chưa
                existing_slots = db.query(TimeSlot).filter(
                    TimeSlot.san_id == sanbong.id,
                    TimeSlot.date == future_date
                ).first()

                if existing_slots:
                    logging.info(f"Time slots for SanBong ID {sanbong.id} already exist for {today}. Skipping...")
                    continue
                # Tạo mới nếu chưa tồn tại
                create_time_slots_for_day(db=db, san_id=sanbong.id, today=future_date)

    finally:
        db.close()
        logging.info("create_daily_time_slots completed")
       
    # Tạo time slot cho ngày hôm đó dù nó đã qua thời gian now
    for sanbong in sanbongs:
        existing_slots = db.query(TimeSlot).filter(
        TimeSlot.san_id == sanbong.id,
        TimeSlot.date == today
        ).first()
        if not existing_slots:
            create_time_slots_for_day(db=db, san_id=sanbong.id, today=today)
# Hàm cập nhật trạng thái TimeSlot khi thời gian hiện tại đã qua end_time
def update_time_slots_status():
    db: Session = SessionLocal()
    try:
        current_time = datetime.now().time()
        affected_slots = db.query(TimeSlot).filter(
            TimeSlot.start_time < current_time,
            TimeSlot.date == datetime.now().date(), 
            TimeSlot.is_available == True
        ).all()

        for slot in affected_slots:
            slot.is_available = False
            logging.info(f"Updated TimeSlot ID {slot.id} to unavailable.")

        db.commit()
    finally:
        db.close()
        logging.info("update_time_slots_status completed.")

#cập nhật trạng thái sân nếu như thời gian đó có người đặt sân tới thời điểm đó chuyển trạng thái sân thành đang sử dụng ở trong bảng đặt sân
def update_sanbong_status_used():
    db: Session = SessionLocal()
    try:
        current_date = datetime.now().date()
        current_time = datetime.now().time()

        # Truy vấn các bản ghi trong DatSan thỏa mãn điều kiện
        dat_san_records = (
            db.query(DatSan)
            .join(TimeSlot, DatSan.timeslot_id == TimeSlot.id)
            .filter(TimeSlot.date == current_date)  # Ngày hiện tại
            .filter(TimeSlot.start_time <= current_time)  # Giờ bắt đầu trước hoặc bằng giờ hiện tại
            .filter(TimeSlot.end_time >= current_time)  # Giờ kết thúc sau hoặc bằng giờ hiện tại
            .all()
        )

        # Cập nhật trạng thái của sân bóng
        for record in dat_san_records:
            san_bong = db.query(SanBong).filter(SanBong.id == record.id_san).first()
            if san_bong:
                san_bong.trang_thai = 0  # Đang sử dụng
                db.add(san_bong)
                logging.info(f"Sân bóng ID {san_bong.id} đã được cập nhật trạng thái sử dụng ")  # Log ID sân bóng

        # Cập nhật trạng thái sân bóng khi khung giờ đã qua
        past_time_slots = (
            db.query(DatSan)
            .join(TimeSlot, DatSan.timeslot_id == TimeSlot.id)
            .filter(TimeSlot.date == current_date)
            .filter(TimeSlot.end_time < current_time)
            .all()
        )

        for slot in past_time_slots:
            san_bong = db.query(SanBong).filter(SanBong.id == slot.id_san).first()
            if san_bong:
                san_bong.trang_thai = 1  # Không sử dụng
                db.add(san_bong)
                logging.info(f"Sân bóng ID {san_bong.id} đã được cập nhật trạng thái không sử dụng")  # Log ID sân bóng

        db.commit()
    finally:
        db.close()
        logging.info("update_sanbong_status completed.")

# Đường dẫn tới file database và thư mục sao lưu
DB_PATH = "sanbong_api.db"
BACKUP_DIR = "backups"
os.makedirs(BACKUP_DIR, exist_ok=True)

def auto_backup_database():
    try:
        # Tạo tên file sao lưu với timestamp
        backup_file = os.path.join(BACKUP_DIR, f"backup_{datetime.now().strftime('%Y%m%d%H%M%S')}.sqlite")
        shutil.copy(DB_PATH, backup_file)
        logging.info(f"Database backup created at {backup_file}")
    except Exception as e:
        logging.error(f"Backup failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

    
def start_scheduler():
    scheduler = BackgroundScheduler()
    create_daily_time_slots()  # Tạo khung giờ ngay khi server khởi động
    update_time_slots_status()
    update_sanbong_status_used()
    auto_backup_database()
    scheduler.add_job(update_sanbong_status_used, 'interval', seconds=30)  # Cập nhật trạng thái mỗi 30 giây
    scheduler.add_job(create_daily_time_slots, 'cron', hour=0, minute=0)  # Chạy vào 00:00 hàng ngày
    scheduler.add_job(update_time_slots_status, 'interval', minutes=1)  # Cập nhật trạng thái mỗi phút
    scheduler.add_job(auto_backup_database, 'interval', hours=1)  # Sao lưu mỗi 1 tiếng
    scheduler.start()
    logging.info("Scheduler started with daily and interval jobs.")
    