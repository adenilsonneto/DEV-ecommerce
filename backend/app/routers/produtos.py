from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.categoria_imagem import CategoriaImagem
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoUpdate, ProdutoResponse, ProdutoListItem

router = APIRouter(prefix="/produtos", tags=["Produtos"])


def calcular_stats(id_produto: str, db: Session) -> dict: #calcular total de vendas, receita total e media de avaliacoes do produto atraves do id do produto
    itens = db.query(ItemPedido).filter(
        ItemPedido.id_produto == id_produto
    ).all()

    if not itens:
        return {"total_vendas": 0, "receita_total": 0.0, "media_avaliacoes": None}

    total_vendas = len(itens)
    receita_total = sum(item.preco_BRL for item in itens if item.preco_BRL)

    ids_pedidos = [item.id_pedido for item in itens]

    media = db.query(func.avg(AvaliacaoPedido.avaliacao)).filter(
        AvaliacaoPedido.id_pedido.in_(ids_pedidos)
    ).scalar()

    return {
        "total_vendas": total_vendas,
        "receita_total": round(receita_total, 2),
        "media_avaliacoes": round(float(media), 2) if media else None
    }


def buscar_imagem(categoria: str, db: Session) -> Optional[str]: #buscar imagem da categoria do produto no banco e retornar link da imagem
    imagem = db.query(CategoriaImagem).filter(
        CategoriaImagem.categoria == categoria
    ).first()
    return imagem.link if imagem else None


@router.get("/", response_model=List[ProdutoListItem])
def listar_produtos(
    busca: Optional[str] = Query(None, description="Filtra por nome do produto"),
    categoria: Optional[str] = Query(None, description="Filtra por categoria"),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Produto)

    if busca:
        query = query.filter(Produto.nome_produto.ilike(f"%{busca}%"))

    if categoria:
        query = query.filter(Produto.categoria_produto == categoria)

    offset = (pagina - 1) * por_pagina
    produtos = query.offset(offset).limit(por_pagina).all()

    resultado = []
    for p in produtos:
        stats = calcular_stats(p.id_produto, db)
        resultado.append(ProdutoListItem(
            id_produto=p.id_produto,
            nome_produto=p.nome_produto,
            categoria_produto=p.categoria_produto,
            imagem_url=buscar_imagem(p.categoria_produto, db),
            media_avaliacoes=stats["media_avaliacoes"],
            total_vendas=stats["total_vendas"]
        ))

    return resultado


@router.get("/{id_produto}", response_model=ProdutoResponse)
def obter_produto(id_produto: str, db: Session = Depends(get_db)): #obter produto por id do banco e incluir media de avaliacoes, total de vendas, receita total e link da imagem da categoria do produto
    produto = db.query(Produto).filter(
        Produto.id_produto == id_produto
    ).first()

    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    stats = calcular_stats(id_produto, db)

    return ProdutoResponse(
        id_produto=produto.id_produto,
        nome_produto=produto.nome_produto,
        categoria_produto=produto.categoria_produto,
        peso_produto_gramas=produto.peso_produto_gramas,
        comprimento_centimetros=produto.comprimento_centimetros,
        altura_centimetros=produto.altura_centimetros,
        largura_centimetros=produto.largura_centimetros,
        imagem_url=buscar_imagem(produto.categoria_produto, db),
        **stats
    )


@router.get("/{id_produto}/avaliacoes")
def listar_avaliacoes(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(
        Produto.id_produto == id_produto
    ).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    ids_pedidos = [
        item.id_pedido for item in
        db.query(ItemPedido).filter(ItemPedido.id_produto == id_produto).all()
    ]

    avaliacoes = db.query(AvaliacaoPedido).filter(
        AvaliacaoPedido.id_pedido.in_(ids_pedidos)
    ).limit(50).all()

    return [
        {
            "id_avaliacao": av.id_avaliacao,
            "nota": av.avaliacao,
            "titulo": av.titulo_comentario,
            "comentario": av.comentario,
            "data": av.data_comentario
        }
        for av in avaliacoes
    ]


@router.post("/", response_model=ProdutoResponse, status_code=201)
def criar_produto(dados: ProdutoCreate, db: Session = Depends(get_db)):
    novo_id = uuid.uuid4().hex

    novo_produto = Produto(
        id_produto=novo_id,
        **dados.dict()
    )
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)

    return ProdutoResponse(
        **{c.name: getattr(novo_produto, c.name) for c in novo_produto.__table__.columns},
        imagem_url=buscar_imagem(novo_produto.categoria_produto, db),
        media_avaliacoes=None,
        total_vendas=0,
        receita_total=0.0
    )


@router.put("/{id_produto}", response_model=ProdutoResponse)
def atualizar_produto(
    id_produto: str,
    dados: ProdutoUpdate,
    db: Session = Depends(get_db)
): #atualizar produto no banco atraves do json recebido e id do produto
    produto = db.query(Produto).filter(
        Produto.id_produto == id_produto
    ).first()

    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    campos_atualizados = dados.dict(exclude_unset=True)
    for campo, valor in campos_atualizados.items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)

    stats = calcular_stats(produto.id_produto, db)

    return ProdutoResponse(
        **{c.name: getattr(produto, c.name) for c in produto.__table__.columns},
        imagem_url=buscar_imagem(produto.categoria_produto, db),
        **stats
    )


@router.delete("/{id_produto}", status_code=204)
def remover_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(
        Produto.id_produto == id_produto
    ).first()

    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    db.delete(produto)
    db.commit()