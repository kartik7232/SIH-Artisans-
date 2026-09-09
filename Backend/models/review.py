from sqlalchemy import Column, Integer, String
from database import Base


class ReviewModel(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, nullable=False)

    product_id = Column(Integer, nullable=False)

    rating = Column(Integer, nullable=False)

    comment = Column(String, nullable=True)