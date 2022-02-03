from datetime import date
from typing import List

from pydantic import BaseModel


class Trivia(BaseModel):
    id: int
    active_date: date
    category: str
    difficulty: str
    question: str
    correct_answer: str
    active: bool


class TriviaList(BaseModel):
    trivias: List[Trivia]
