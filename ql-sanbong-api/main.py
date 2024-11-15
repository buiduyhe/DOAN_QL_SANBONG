from fastapi import FastAPI
from db import models
from db.database import engine
from routers import user ,dichvu,comment,san
from fastapi.staticfiles import StaticFiles
from routers import authentication
from fastapi.middleware.cors import CORSMiddleware

from scheduler import start_scheduler

app= FastAPI()

app.include_router(authentication.router)
app.include_router(user.router)
app.include_router(dichvu.router)
app.include_router(san.router)


@app.get("/")
def root():
    return "Hello world"


origins =[
    'http://localhost:3000'
]



models.Base.metadata.create_all(engine)



app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
app.mount('/images',StaticFiles(directory='images'),name ='images')

@app.on_event("startup")
def startup_event():
    start_scheduler()
    print("Scheduler started.")