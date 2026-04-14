# backend/app/schemas/produto.py

from pydantic import BaseModel
from typing import Optional

#schema base: campos comuns a todos os schemas de produto
class ProdutoBase(BaseModel):
    nome_produto:            str
    categoria_produto:       Optional[str] = None
    peso_produto_gramas:     Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros:      Optional[float] = None
    largura_centimetros:     Optional[float] = None


#schema para criar um produto
#id_produto é gerado automaticamente, então não está aqui
class ProdutoCreate(ProdutoBase):
    pass


#schema para só atualizar o que foi enviado)
class ProdutoUpdate(BaseModel):
    nome_produto:            Optional[str]   = None
    categoria_produto:       Optional[str]   = None
    peso_produto_gramas:     Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros:      Optional[float] = None
    largura_centimetros:     Optional[float] = None


#schema de resposta da API
class ProdutoResponse(ProdutoBase):
    id_produto:         str
    imagem_url:         Optional[str]   = None   # vem de dim_categoria_imagens
    media_avaliacoes:   Optional[float] = None   # calculado
    total_vendas:       Optional[int]   = None   # calculado
    receita_total:      Optional[float] = None   # calculado

    class Config:
        from_attributes = True  # permite converter objeto SQLAlchemy em Pydantic


#schema resumido para a listagem 
class ProdutoListItem(BaseModel):
    id_produto:       str
    nome_produto:     str
    categoria_produto: Optional[str]  = None
    imagem_url:        Optional[str]  = None
    media_avaliacoes:  Optional[float] = None
    total_vendas:      Optional[int]  = None

    class Config:
        from_attributes = True