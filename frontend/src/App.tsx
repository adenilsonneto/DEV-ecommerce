import {BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogoProdutos from './pages/CatalogoProdutos';
import DetalhesProduto from './pages/DetalhesProduto';
import NovoProduto from './pages/NovoProduto';
import EditarProduto from './pages/EditarProduto';
import NotFound from './pages/NotFound';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        {/*Rota principal: catálogo de produtos */}
        <Route path="/"element={<CatalogoProdutos/>} />
        {/*Detalhes de um produto específico — :id é um parâmetro dinâmico */}
        <Route path="/produtos/:id"element={<DetalhesProduto/>}/>
        {/*Formulário para criar novo produto */}
        <Route path="/produtos/novo"element={<NovoProduto/>}/>
        {/*Formulário para editar um produto */}
        <Route path="/produtos/:id/editar"element={<EditarProduto/>}/>
        {/*Página 404 — qualquer rota não encontrada */}
        <Route path="*"element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
