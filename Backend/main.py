from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from passlib.context import CryptContext

from database import engine, Base, SessionLocal

from models.user import UserModel
from models.product import ProductModel

from schemas.user import UserCreate, UserLogin, UserResponse
from schemas.product import ProductCreate, ProductResponse

from auth import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from fastapi import UploadFile, File, HTTPException
from uuid import uuid4

from supabase_client import supabase
app = FastAPI(title="Artisan AI Backend")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

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

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(
        UserModel.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/profile")
def get_profile(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):

    payload = verify_access_token(token)
    user_id = int(payload.get("sub"))
    user = db.query(UserModel).filter(
        UserModel.id == user_id
    ).first()


    if not user:
        raise HTTPException(
            status_code = 404,
            detail = "User not found"
        )

    return {
        "id": user.id, 
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

def require_role(required_role: str):
    def role_checker(token: str = Depends(oauth2_scheme)):
        payload = verify_access_token(token)
        user_role = payload.get("role")
        if user_role != required_role:
            raise HTTPException(
                status_code = 403,
                detail = "You don't have permission to this resource"
            )
        return payload
    return role_checker

@app.get("/admin-test")
def admin_test(payload = Depends(require_role("admin"))):
    return {
        "message": "Welcome admin!"
    }

@app.get("/admin/users", response_model = list[UserResponse])
def get_all_users(payload = Depends(require_role("admin")), db: Session = Depends(get_db)):
    users = db.query(UserModel).all()
    return users

@app.post("/products", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    artisan_id = int(payload.get("sub"))

    new_product = ProductModel(
        artisan_id=artisan_id,
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        image_url=product.image_url
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@app.get("/products", response_model=list[ProductResponse])
def get_products(
    db: Session = Depends(get_db)
):
    products = db.query(ProductModel).all()

    return products



BUCKET_NAME = "sih-artisan-products"

@app.post("/products/upload-image")
async def upload_product_image(file: UploadFile = File(...)):

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, and WEBP images are allowed"
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    extension = (
        file.filename.rsplit(".", 1)[-1].lower()
        if file.filename and "." in file.filename
        else "jpg"
    )

    file_path = f"products/{uuid4()}.{extension}"

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            file_path,
            contents,
            {
                "content-type": file.content_type
            }
        )

        public_url = supabase.storage \
            .from_(BUCKET_NAME) \
            .get_public_url(file_path)

        return {
            "message": "Image uploaded successfully",
            "image_url": public_url,
            "file_path": file_path
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image upload failed: {str(e)}"
        )