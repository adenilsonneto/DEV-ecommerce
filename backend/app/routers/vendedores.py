from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vendedor import Vendedor
from app.schemas.vendedor import VendedorCreate, VendedorResponse

router = APIRouter(prefix="/vendedores", tags=["Vendedores"])


@router.get("/", response_model=list[VendedorResponse])
def listar_vendedores(db: Session = Depends(get_db)):
    return db.query(Vendedor).all()


@router.get("/{id_vendedor}", response_model=VendedorResponse)
def obter_vendedor(id_vendedor: str, db: Session = Depends(get_db)):
    vendedor = db.query(Vendedor).filter(
        Vendedor.id_vendedor == id_vendedor
    ).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    return vendedor


@router.post("/", response_model=VendedorResponse, status_code=201)
def criar_vendedor(vendedor: VendedorCreate, db: Session = Depends(get_db)):
    db_vendedor = Vendedor(**vendedor.model_dump())
    db.add(db_vendedor)
    db.commit()
    db.refresh(db_vendedor)
    return db_vendedor


@router.put("/{id_vendedor}", response_model=VendedorResponse)
def atualizar_vendedor(
    id_vendedor: str,
    dados: VendedorCreate,
    db: Session = Depends(get_db),
):
    vendedor = db.query(Vendedor).filter(
        Vendedor.id_vendedor == id_vendedor
    ).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(vendedor, campo, valor)
    db.commit()
    db.refresh(vendedor)
    return vendedor


@router.delete("/{id_vendedor}", status_code=204)
def deletar_vendedor(id_vendedor: str, db: Session = Depends(get_db)):
    vendedor = db.query(Vendedor).filter(
        Vendedor.id_vendedor == id_vendedor
    ).first()
    if not vendedor:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")
    db.delete(vendedor)
    db.commit()