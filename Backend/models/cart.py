from sqlalchemy import Column, Integer
from database import Base


class CartModel(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, nullable=False)

    product_id = Column(Integer, nullable=False)

    quantity = Column(Integer, default=1)