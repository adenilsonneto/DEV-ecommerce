from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from app.routers import pedidos, produtos, consumidores, vendedores importa as rotas
from app.database import engine, Base

Base.metadata.create_all(bind=engine) #cria as tabelas no banco de dados

app = FastAPI(
    title="Sistema de Compras Online",
    description="API para gerenciamento de pedidos, produtos, consumidores e vendedores.",
    version="1.0.0",
)

#permite que o frontend acesse a API sem problemas de CORS, que é justamente quem libera o acesso para dominios diferentes
app.add_middleware(
CORSMiddleware,
allow_origins=["http://localhost:5173"], # porta padrão do Vite
allow_credentials=True,
allow_methods=["*"], # GET, POST, PUT, DELETE
allow_headers=["*"],
)

#Registra as rotas
#app.include_router(produtos.router)
#app.include_router(pedidos.router)
#app.include_router(consumidores.router)
#app.include_router(vendedores.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
