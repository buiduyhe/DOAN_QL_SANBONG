# scheduler.py

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta ,date
from sqlalchemy.orm import Session
from db.database import SessionLocal, get_db
from db.models import SanBong, TimeSlot
    
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
       

# Hàm cập nhật trạng thái TimeSlot khi thời gian hiện tại đã qua end_time
def update_time_slots_status():
    db: Session = SessionLocal()
    try:
        current_time = datetime.now().time()
        affected_slots = db.query(TimeSlot).filter(
            TimeSlot.start_time < current_time,
            TimeSlot.is_available == True
        ).all()

        for slot in affected_slots:
            slot.is_available = False
            logging.info(f"Updated TimeSlot ID {slot.id} to unavailable.")

        db.commit()
    finally:
        db.close()
        logging.info("update_time_slots_status completed.")


# Cấu hình scheduler
def start_scheduler():
    scheduler = BackgroundScheduler()
    create_daily_time_slots()  # Tạo khung giờ ngay khi server khởi động
    update_time_slots_status()
    scheduler.add_job(create_daily_time_slots, 'cron', hour=0, minute=0)  # Chạy vào 00:00 hàng ngày
    scheduler.add_job(update_time_slots_status, 'interval', minutes=1)  # Cập nhật trạng thái mỗi phút
    scheduler.start()
    logging.info("Scheduler started with daily and interval jobs.")
