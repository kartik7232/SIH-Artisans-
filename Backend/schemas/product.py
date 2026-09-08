from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str | None = None

class ProductResponse(ProductCreate):
    id: int
    artisan_id: int

    class Config:
        from_attributes = True