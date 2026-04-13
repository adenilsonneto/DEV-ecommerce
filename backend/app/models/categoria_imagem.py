from sqlalchemy import Column, String
from app.database import Base

class CategoriaImagem(Base):
    __tablename__ = "dim_categoria_imagens"

    categoria = Column(String, primary_key=True)
    link      = Column(String) # URL da imagem