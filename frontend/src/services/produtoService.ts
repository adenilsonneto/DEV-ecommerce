import api from './api';
import { Produto, ProdutoCreate, ProdutoUpdate } from '../types/produto';


//busca todos os produtos (com opção de filtrar por nome)
export const getProdutos = async (search?: string): Promise<Produto[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/produtos', { params });
return response.data;
};
//busca um produto pelo ID
export const getProdutoById = async (id: number): Promise<Produto> => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
};
//cria um novo produto
export const createProduto = async (produto: ProdutoCreate): Promise<Produto> => {
    const response = await api.post('/produtos', produto);
    return response.data;
};
//atualiza um produto existente
export const updateProduto = async (id: number, produto: ProdutoUpdate): Promise<Produto> => {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
};
//deleta um produto
export const deleteProduto = async (id: number): Promise<void> => { 
await api.delete(`/produtos/${id}`)};
