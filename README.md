# 🛒 E-Commerce Manager
Sistema de gerenciamento de produtos — Visagio Rocket Lab 2026
## 📋 Pré-requisitos- Python 3.10+- Node.js 18+- Git
## 🚀 Como executar
### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/ecommerce-rocketlab.git
cd ecommerce-rocketlab
```
### 2. Obtenha os arquivos de dados
Coloque os 7 arquivos CSV fornecidos na pasta `data/` na raiz do projeto:
- dim_produtos.csv
- dim_categoria_imagens.csv
- dim_consumidores.csv
- dim_vendedores.csv
- fat_pedidos.csv
- fat_itens_pedidos.csv
- fat_avaliacoes_pedidos.csv
- 
### 3. Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/popular_banco.py
uvicorn app.main:app --reload
```
API disponível em: http://localhost:8000
Documentação interativa: http://localhost:8000/docs
### 4. Frontend (novo terminal)
```bash
cd frontend
npm install
npm run dev
```
Aplicação disponível em: http://localhost:5173

## 🛠 Stack- **Frontend**: Vite, React, TypeScript, React Router, Axios- **Backend**: FastAPI (Python)- **Banco de dados**: SQLite + SQLAlchemy + Alembic
## ✅ Funcionalidades- [x] Catálogo de produtos com imagens por categoria
- [x] Busca de produtos por nome com debounce
- [x] Paginação via backend
- [x] Detalhes do produto: medidas físicas, total de vendas, receita e avaliações
- [x] Média de avaliações calculada por produto
- [x] Criar, editar e remover produtos (CRUD completo)
- [x] Documentação automática da API (Swagger UI)
