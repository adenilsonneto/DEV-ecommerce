import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.consumidor import Consumidor
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido

client = TestClient(app)

#roda antes de todos os testes — limpa dados de execuções anteriores
@pytest.fixture(autouse=True, scope="session")
def limpar_dados_teste():
    db = SessionLocal()
    db.query(Pedido).filter(Pedido.id_pedido == "teste_ped_01").delete()
    db.query(Consumidor).filter(Consumidor.id_consumidor == "teste_cons_01").delete()
    db.query(Vendedor).filter(Vendedor.id_vendedor == "teste_vend_01").delete()
    db.commit()
    db.close()
    yield


def test_criar_consumidor():
    r = client.post("/consumidores/", json={
        "id_consumidor": "teste_cons_01",
        "prefixo_cep": "50000",
        "nome_consumidor": "João Teste",
        "cidade": "Recife",
        "estado": "PE"
    })
    assert r.status_code == 201

def test_listar_consumidores():
    r = client.get("/consumidores/")
    assert r.status_code == 200

def test_obter_consumidor():
    r = client.get("/consumidores/teste_cons_01")
    assert r.status_code == 200

def test_atualizar_consumidor():
    r = client.put("/consumidores/teste_cons_01", json={
        "id_consumidor": "teste_cons_01",
        "prefixo_cep": "50000",
        "nome_consumidor": "João Editado",
        "cidade": "Recife",
        "estado": "PE"
    })
    assert r.status_code == 200


def test_criar_vendedor():
    r = client.post("/vendedores/", json={
        "id_vendedor": "teste_vend_01",
        "nome_vendedor": "Loja Teste",
        "prefixo_cep": "50000",
        "cidade": "Recife",
        "estado": "PE"
    })
    assert r.status_code == 201

def test_listar_vendedores():
    r = client.get("/vendedores/")
    assert r.status_code == 200

def test_obter_vendedor():
    r = client.get("/vendedores/teste_vend_01")
    assert r.status_code == 200

def test_atualizar_vendedor():
    r = client.put("/vendedores/teste_vend_01", json={
        "id_vendedor": "teste_vend_01",
        "nome_vendedor": "Loja Editada",
        "prefixo_cep": "50000",
        "cidade": "Recife",
        "estado": "PE"
    })
    assert r.status_code == 200


def test_criar_pedido():
    r = client.post("/pedidos/", json={
        "id_pedido": "teste_ped_01",
        "id_consumidor": "teste_cons_01",
        "status": "aprovado"
    })
    assert r.status_code == 201

def test_listar_pedidos():
    r = client.get("/pedidos/?pagina=1&por_pagina=20")
    assert r.status_code == 200

def test_obter_pedido():
    r = client.get("/pedidos/teste_ped_01")
    assert r.status_code == 200

def test_listar_itens_pedido():
    r = client.get("/pedidos/teste_ped_01/itens")
    assert r.status_code == 200

def test_listar_avaliacoes_pedido():
    r = client.get("/pedidos/teste_ped_01/avaliacoes")
    assert r.status_code == 200

def test_atualizar_pedido():
    r = client.put("/pedidos/teste_ped_01", json={
        "id_pedido": "teste_ped_01",
        "id_consumidor": "teste_cons_01",
        "status": "entregue"
    })
    assert r.status_code == 200

def test_deletar_pedido():
    r = client.delete("/pedidos/teste_ped_01")
    assert r.status_code == 204

def test_deletar_consumidor():
    r = client.delete("/consumidores/teste_cons_01")
    assert r.status_code == 204

def test_deletar_vendedor():
    r = client.delete("/vendedores/teste_vend_01")
    assert r.status_code == 204