from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models

router = APIRouter()

@router.get("/produtos/{produto_id}/avaliacoes")
def get_avaliacoes(produto_id: int, db: Session = Depends(get_db)):
    return db.query(models.Avaliacao).filter(
        models.Avaliacao.produto_id == produto_id
    ).all()