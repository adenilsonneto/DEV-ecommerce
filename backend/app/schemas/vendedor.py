from pydantic import BaseModel
from typing import Optional

class VendedorBase(BaseModel):
    nome_vendedor: str
    prefixo_cep: str
    cidade: str
    estado: str


class VendedorCreate(VendedorBase):
    id_vendedor: str


class VendedorUpdate(VendedorBase):
    nome_vendedor: Optional[str] = None
    prefixo_cep: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None

class VendedorResponse(VendedorBase):
    id_vendedor: str

    class Config:
        from_attributes = True