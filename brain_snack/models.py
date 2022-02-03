import datetime

from database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Trivia(Base):
    __tablename__ = "trivia"

    id = Column(Integer, primary_key=True, index=True)
    active_date = Column(DateTime, default=datetime.date.today())
    category = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    question = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    active = Column(Boolean, default=True)
