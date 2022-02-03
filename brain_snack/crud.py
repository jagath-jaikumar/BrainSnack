import models


def get_trivia(session):
    return session.query(models.Trivia).filter(models.Trivia.active).all()
