# scheduler.py

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import SanBong, TimeSlot

def get_available_slots(db: Session, san_id: int, booking_date: date):
    return db.query(TimeSlot).filter(
        TimeSlot.san_id == san_id,
        TimeSlot.date == booking_date,
        TimeSlot.is_available == True
    ).all()
    
# Hàm tạo khung giờ hàng ngày cho tất cả các sân
def create_time_slots_for_day(db, sanbong_id, date):
    start_time = datetime.combine(date, datetime.strptime("05:00", "%H:%M").time())
    end_time = datetime.combine(date, datetime.strptime("23:00", "%H:%M").time())
    time_interval = timedelta(hours=1, minutes=30)

    while start_time < end_time:
        slot_end_time = start_time + time_interval
        # Thêm khung giờ vào bảng TIME_SLOT
        new_slot = TimeSlot(
            sanbong_id=sanbong_id,
            start_time=start_time,
            end_time=slot_end_time,
            is_available=True
        )
        db.add(new_slot)
        start_time = slot_end_time

    db.commit()
    
    
def create_daily_time_slots():
    db = SessionLocal()
    try:
        today = datetime.now().date()
        sanbongs = db.query(SanBong).all()

        for sanbong in sanbongs:
            create_time_slots_for_day(db, sanbong.id, today)

        print(f"[{datetime.now()}] Created time slots for all fields for {today}")
    finally:
        db.close()

# Cấu hình scheduler
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(create_daily_time_slots, 'cron', hour=10, minute=55)  # Chạy vào 00:00 hàng ngày
    scheduler.start()
