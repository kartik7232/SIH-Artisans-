from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from passlib.context import CryptContext
from database import engine, Base, SessionLocal
from models.user import UserModel
from schemas.user import UserCreate, UserResponse

app = FastAPI(title="Artisan AI Backend")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "message": "Artisan AI Backend is running"
    }

@app.post("/register",  response_model = UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user= UserModel(
        username = user.username, 
        email=user.email,
        password=pwd_context.hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
