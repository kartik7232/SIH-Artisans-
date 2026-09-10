from pydantic import BaseModel


class ReviewCreate(BaseModel):
    product_id: int
    rating: int
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    buyer_id: int
    product_id: int
    rating: int
    comment: str | None

    class Config:
        from_attributes = True