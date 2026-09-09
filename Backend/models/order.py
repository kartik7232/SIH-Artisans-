from sqlalchemy import Column, Integer, String, Float
from database import Base


class OrderModel(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, nullable=False)

    product_id = Column(Integer, nullable=False)

    quantity = Column(Integer, default=1)

    total_price = Column(Float, nullable=False)

    status = Column(
        String,
        default="pending"
    )