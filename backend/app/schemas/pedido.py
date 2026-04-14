from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel




class ItemPedidoBase(BaseModel):
    id_item: int
    id_produto: str
    id_vendedor: str
    preco_BRL: float
    preco_frete: float


class ItemPedidoCreate(ItemPedidoBase):
    id_pedido: str


class ItemPedidoResponse(ItemPedidoBase):
    id_pedido: str

    class Config:
        from_attributes = True



class AvaliacaoPedidoBase(BaseModel):
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None
    data_resposta: Optional[datetime] = None


class AvaliacaoPedidoCreate(AvaliacaoPedidoBase):
    id_avaliacao: str
    id_pedido: str


class AvaliacaoPedidoResponse(AvaliacaoPedidoBase):
    id_avaliacao: str
    id_pedido: str

    class Config:
        from_attributes = True


class PedidoBase(BaseModel):
    id_consumidor: str
    status: str
    pedido_compra_timestamp: Optional[datetime] = None
    pedido_entregue_timestamp: Optional[datetime] = None
    data_estimada_entrega: Optional[date] = None
    tempo_entrega_dias: Optional[float] = None
    tempo_entrega_estimado_dias: Optional[float] = None
    diferenca_entrega_dias: Optional[float] = None
    entrega_no_prazo: Optional[str] = None


class PedidoCreate(PedidoBase):
    id_pedido: str


class PedidoResponse(PedidoBase):
    id_pedido: str
    itens: list[ItemPedidoResponse] = []
    avaliacoes: list[AvaliacaoPedidoResponse] = []

    class Config:
        from_attributes = True