from pydantic import BaseModel

class AvaliacaoBase(BaseModel):
    nota: int
    comentario: str
    produto_id: int

class AvaliacaoResponse(AvaliacaoBase):
    id: int

    class Config:
        from_attributes = True