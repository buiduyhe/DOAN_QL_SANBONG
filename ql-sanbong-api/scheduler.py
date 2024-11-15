# scheduler.py

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from db.database import SessionLocal, get_db
from db.models import SanBong, TimeSlot
from sqlalchemy import Time

def get_available_slots(db: Session, san_id: int, booking_date: date):
    return db.query(TimeSlot).filter(
        TimeSlot.san_id == san_id,
        TimeSlot.date == booking_date,
        TimeSlot.is_available == True
    ).all()
    
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
            date=today,  # Assign the correct date
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

        for sanbong in sanbongs:
            # Kiểm tra xem khung giờ đã tồn tại cho ngày hôm nay chưa
            existing_slots = db.query(TimeSlot).filter(
                TimeSlot.san_id == sanbong.id,
                TimeSlot.date == today
            ).first()

            if existing_slots:
                logging.info(f"Time slots for SanBong ID {sanbong.id} already exist for {today}. Skipping...")
                continue

            # Tạo mới nếu chưa tồn tại
            create_time_slots_for_day(db=db, san_id=sanbong.id, today=today)

    finally:
        db.close()
        logging.info("create_daily_time_slots completed")

        db.close()
        logging.info("create_daily_time_slots completed")
        

# Cấu hình scheduler
def start_scheduler():
    scheduler = BackgroundScheduler()
    create_daily_time_slots()  # Run the job immediately when the server starts
    scheduler.start()
    logging.info("Scheduler started and job added.")
