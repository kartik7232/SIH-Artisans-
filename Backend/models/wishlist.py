from sqlalchemy import Column, Integer
from database import Base


class WishlistModel(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, nullable=False)

    product_id = Column(Integer, nullable=False)