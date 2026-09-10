# models/rfq.py

from sqlalchemy import Column, Integer, String
from database import Base


class RFQModel(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)

    buyer_id = Column(Integer, nullable=False)

    product_id = Column(Integer, nullable=False)

    quantity = Column(Integer, nullable=False)

    message = Column(String, nullable=True)

    status = Column(String, default="open")