from pydantic import BaseModel
from typing import Optional


class ConsumidorBase(BaseModel): #cria uma classe que representa a estrutura de dados do consumidor
    prefixo_cep: str
    nome_consumidor: str
    cidade: str
    estado: str

class ConsumidorCreate(ConsumidorBase): #classe que herda da classe ConsumidorBase e adiciona o campo id_consumidor para criar um novo consumidor
    id_consumidor: str


class ConsumidorUpdate(ConsumidorBase): #classe que herda da classe ConsumidorBase e torna todos os campos opcionais para atualizar um consumidor existente 
    prefixo_cep: Optional[str] = None
    nome_consumidor: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None

class ConsumidorResponse(ConsumidorBase): #classe que herda da classe ConsumidorBase e adiciona o campo id_consumidor para representar a resposta da API ao obter um consumidor
    id_consumidor: str

    class Config:
        from_attributes = True