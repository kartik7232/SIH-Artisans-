from pydantic import BaseModel


class RFQCreate(BaseModel):
    product_id: int
    quantity: int
    message: str | None = None


class RFQResponse(BaseModel):
    id: int
    buyer_id: int
    product_id: int
    quantity: int
    message: str | None
    status: str

    class Config:
        from_attributes = True