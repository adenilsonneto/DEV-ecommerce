from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consumidor import Consumidor
from app.schemas.consumidor import ConsumidorCreate, ConsumidorResponse

router = APIRouter(prefix="/consumidores", tags=["Consumidores"])


@router.get("/", response_model=list[ConsumidorResponse])
def listar_consumidores(db: Session = Depends(get_db)):
    return db.query(Consumidor).all()


@router.get("/{id_consumidor}", response_model=ConsumidorResponse)
def obter_consumidor(id_consumidor: str, db: Session = Depends(get_db)):
    consumidor = db.query(Consumidor).filter(
        Consumidor.id_consumidor == id_consumidor
    ).first()
    if not consumidor:
        raise HTTPException(status_code=404, detail="Consumidor não encontrado")
    return consumidor


@router.post("/", response_model=ConsumidorResponse, status_code=201)
def criar_consumidor(consumidor: ConsumidorCreate, db: Session = Depends(get_db)):
    db_consumidor = Consumidor(**consumidor.model_dump())
    db.add(db_consumidor)
    db.commit()
    db.refresh(db_consumidor)
    return db_consumidor


@router.put("/{id_consumidor}", response_model=ConsumidorResponse)
def atualizar_consumidor(
    id_consumidor: str,
    dados: ConsumidorCreate,
    db: Session = Depends(get_db),
):
    consumidor = db.query(Consumidor).filter(
        Consumidor.id_consumidor == id_consumidor
    ).first()
    if not consumidor:
        raise HTTPException(status_code=404, detail="Consumidor não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(consumidor, campo, valor)
    db.commit()
    db.refresh(consumidor)
    return consumidor


@router.delete("/{id_consumidor}", status_code=204)
def deletar_consumidor(id_consumidor: str, db: Session = Depends(get_db)):
    consumidor = db.query(Consumidor).filter(
        Consumidor.id_consumidor == id_consumidor
    ).first()
    if not consumidor:
        raise HTTPException(status_code=404, detail="Consumidor não encontrado")
    db.delete(consumidor)
    db.commit()