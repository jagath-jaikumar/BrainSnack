import logging

import crud
import models
import requests
import schemas
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from database import SessionLocal, engine
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)


def get_trivia():
    difficulty = ["easy", "medium", "hard"]
    trivias = list()
    for diff in difficulty:
        api_url = f"https://opentdb.com/api.php?amount=1&difficulty={diff}&type=boolean"
        result = requests.get(api_url)
        trivias.extend(result.json()["results"])

    session = SessionLocal()
    previously_active = session.query(models.Trivia).filter(models.Trivia.active).all()
    for pa in previously_active:
        pa.active = False
    session.commit()

    trivia_objects = list()
    for t in trivias:
        t.pop("type")
        t.pop("incorrect_answers")
        trivia_objects.append(models.Trivia(**t))
    session.add_all(trivia_objects)
    session.commit()


get_trivia()
# scheduler = BackgroundScheduler()
# scheduler.start()

# trigger = CronTrigger(year="0", month="0", day="*", hour="*", minute="*", second="*")
# trigger = CronTrigger(year="*", month="*", day="*", hour="*", minute="*", second="*")
# trigger = IntervalTrigger(seconds=50)
# scheduler.add_job(
#     get_trivia,
#     trigger=trigger,
#     name="get trivia",
# )

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/trivia/", response_model=schemas.TriviaList)
def read_items(session: Session = Depends(get_db)):
    trivias = crud.get_trivia(session)
    return schemas.TriviaList(trivias=[schemas.Trivia(**t.__dict__) for t in trivias])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=11000)
