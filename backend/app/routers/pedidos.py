from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import Pedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.item_pedido import ItemPedido
from app.schemas.pedido import (
    AvaliacaoPedidoCreate,
    AvaliacaoPedidoResponse,
    ItemPedidoCreate,
    ItemPedidoResponse,
    PedidoCreate,
    PedidoResponse,
)

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])



@router.get("/", response_model=list[PedidoResponse])
def listar_pedidos(
    pagina: int = 1,
    por_pagina: int = 20,
    db: Session = Depends(get_db)
): #listagem paginada 
    offset = (pagina - 1) * por_pagina
    return db.query(Pedido).offset(offset).limit(por_pagina).all()


@router.get("/{id_pedido}", response_model=PedidoResponse)
def obter_pedido(id_pedido: str, db: Session = Depends(get_db)): #obter pedido por id do banco e incluir itens do pedido
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    return pedido


@router.post("/", response_model=PedidoResponse, status_code=201) #criar pedido no banco atraves do json recebido
def criar_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = Pedido(**pedido.model_dump())
    db.add(db_pedido)
    db.commit()
    db.refresh(db_pedido)
    return db_pedido


@router.put("/{id_pedido}", response_model=PedidoResponse)
def atualizar_pedido(
    id_pedido: str,
    dados: PedidoCreate,
    db: Session = Depends(get_db),
): #atualizar pedido no banco atraves do json recebido e id do pedido
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(pedido, campo, valor)
    db.commit()
    db.refresh(pedido)
    return pedido


@router.delete("/{id_pedido}", status_code=204)
def deletar_pedido(id_pedido: str, db: Session = Depends(get_db)): #deletar pedido do banco atraves do id do pedido
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db.delete(pedido)
    db.commit()




@router.get("/{id_pedido}/itens", response_model=list[ItemPedidoResponse])
def listar_itens_pedido(id_pedido: str, db: Session = Depends(get_db)):
    return db.query(ItemPedido).filter(ItemPedido.id_pedido == id_pedido).all()


@router.post("/{id_pedido}/itens", response_model=ItemPedidoResponse, status_code=201)
def adicionar_item_pedido(
    id_pedido: str,
    item: ItemPedidoCreate,
    db: Session = Depends(get_db),
):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db_item = ItemPedido(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item




@router.get("/{id_pedido}/avaliacoes", response_model=list[AvaliacaoPedidoResponse])
def listar_avaliacoes_pedido(id_pedido: str, db: Session = Depends(get_db)):
    return (
        db.query(AvaliacaoPedido)
        .filter(AvaliacaoPedido.id_pedido == id_pedido)
        .all()
    )


@router.post(
    "/{id_pedido}/avaliacoes",
    response_model=AvaliacaoPedidoResponse,
    status_code=201,
)
def criar_avaliacao_pedido(
    id_pedido: str,
    avaliacao: AvaliacaoPedidoCreate,
    db: Session = Depends(get_db),
):
    pedido = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")
    db_avaliacao = AvaliacaoPedido(**avaliacao.model_dump())
    db.add(db_avaliacao)
    db.commit()
    db.refresh(db_avaliacao)
    return db_avaliacao