from fastapi import FastAPI, Depends, HTTPException

from sqlalchemy.orm import Session

from passlib.context import CryptContext

from database import engine, Base, SessionLocal

from models.user import UserModel
from models.product import ProductModel
from models.order import OrderModel

from schemas.user import UserCreate, UserLogin, UserResponse
from schemas.product import ProductCreate, ProductResponse
from schemas.order import OrderCreate, OrderResponse

from auth import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from fastapi import UploadFile, File, HTTPException
from uuid import uuid4

from supabase_client import supabase

from ai_service import analyze_product_image

import json

from ai_service import recommend_product_price

from models.cart import CartModel
from schemas.cart import CartCreate, CartResponse

from models.wishlist import WishlistModel
from schemas.wishlist import (
    WishlistCreate,
    WishlistResponse
)

from models.review import ReviewModel
from schemas.review import (
    ReviewCreate,
    ReviewResponse
)

from sqlalchemy import func

from models.rfq import RFQModel
from schemas.rfq import RFQCreate, RFQResponse

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

@app.post(
    "/orders",
    response_model=OrderResponse
)
def create_order(
    order: OrderCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    product = db.query(ProductModel).filter(
        ProductModel.id == order.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    total_price = (
        product.price * order.quantity
    )

    new_order = OrderModel(
        buyer_id=buyer_id,
        product_id=product.id,
        quantity=order.quantity,
        total_price=total_price
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order

@app.get(
    "/orders",
    response_model=list[OrderResponse]
)
def get_my_orders(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    orders = db.query(OrderModel).filter(
        OrderModel.buyer_id == buyer_id
    ).all()

    return orders


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

@app.post("/products/analyze-image")
async def analyze_image(file: UploadFile = File(...)):

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

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty"
        )

    try:
        result = analyze_product_image(
            image_bytes,
            file.content_type
        )

        # Remove possible markdown JSON formatting
        result = result.strip()

        if result.startswith("```"):
            result = result.replace("```json", "")
            result = result.replace("```", "")
            result = result.strip()

        result_json = json.loads(result)

        return {
            "message": "Image analyzed successfully",
            "analysis": result_json
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid JSON response"
        )

    except Exception as e:
        print("GEMINI ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

@app.post("/products/recommend-price")
async def recommend_price(
    category: str,
    description: str
):
    try:
        result = recommend_product_price(
            category,
            description
        )

        result_json = json.loads(result)

        return {
            "message": "Price recommendation generated successfully",
            "pricing": result_json
        }

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned invalid pricing JSON"
        )

    except Exception as e:
        print("PRICING ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Price recommendation failed: {str(e)}"
        )

@app.post(
    "/cart",
    response_model=CartResponse
)
def add_to_cart(
    cart: CartCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    item = CartModel(
        buyer_id=buyer_id,
        product_id=cart.product_id,
        quantity=cart.quantity
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.get(
    "/cart",
    response_model=list[CartResponse]
)
def get_cart(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    return (
        db.query(CartModel)
        .filter(CartModel.buyer_id == buyer_id)
        .all()
    )

@app.delete("/cart/{cart_id}")
def delete_cart_item(
    cart_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    item = (
        db.query(CartModel)
        .filter(
            CartModel.id == cart_id,
            CartModel.buyer_id == buyer_id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(item)
    db.commit()

    return {"message": "Removed from cart"}

@app.post(
    "/wishlist",
    response_model=WishlistResponse
)
def add_to_wishlist(
    wishlist: WishlistCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    item = WishlistModel(
        buyer_id=buyer_id,
        product_id=wishlist.product_id
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

@app.get(
    "/wishlist",
    response_model=list[WishlistResponse]
)
def get_wishlist(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    return (
        db.query(WishlistModel)
        .filter(
            WishlistModel.buyer_id == buyer_id
        )
        .all()
    )

@app.delete("/wishlist/{wishlist_id}")
def delete_wishlist_item(
    wishlist_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    item = (
        db.query(WishlistModel)
        .filter(
            WishlistModel.id == wishlist_id,
            WishlistModel.buyer_id == buyer_id
        )
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Wishlist item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Removed from wishlist"
    }


@app.post(
    "/reviews",
    response_model=ReviewResponse
)
def create_review(
    review: ReviewCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    new_review = ReviewModel(
        buyer_id=buyer_id,
        product_id=review.product_id,
        rating=review.rating,
        comment=review.comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review

@app.get(
    "/reviews/{product_id}",
    response_model=list[ReviewResponse]
)
def get_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(ReviewModel)
        .filter(
            ReviewModel.product_id == product_id
        )
        .all()
    )

@app.get("/products/{product_id}/rating")
def product_rating(
    product_id: int,
    db: Session = Depends(get_db)
):
    avg_rating = (
        db.query(func.avg(ReviewModel.rating))
        .filter(
            ReviewModel.product_id == product_id
        )
        .scalar()
    )

    return {
        "product_id": product_id,
        "average_rating": round(avg_rating or 0, 2)
    }

@app.post(
    "/rfqs",
    response_model=RFQResponse
)
def create_rfq(
    rfq: RFQCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    new_rfq = RFQModel(
        buyer_id=buyer_id,
        product_id=rfq.product_id,
        quantity=rfq.quantity,
        message=rfq.message
    )

    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)

    return new_rfq

@app.post(
    "/rfqs",
    response_model=RFQResponse
)
def create_rfq(
    rfq: RFQCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    new_rfq = RFQModel(
        buyer_id=buyer_id,
        product_id=rfq.product_id,
        quantity=rfq.quantity,
        message=rfq.message
    )

    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)

    return new_rfq

@app.get(
    "/rfqs",
    response_model=list[RFQResponse]
)
def get_rfqs(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(token)

    buyer_id = int(payload.get("sub"))

    return (
        db.query(RFQModel)
        .filter(
            RFQModel.buyer_id == buyer_id
        )
        .all()
    )

@app.put("/rfqs/{rfq_id}/status")
def update_rfq_status(
    rfq_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    rfq = (
        db.query(RFQModel)
        .filter(RFQModel.id == rfq_id)
        .first()
    )

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    rfq.status = status

    db.commit()

    return {
        "message": "RFQ updated",
        "status": status
    }


