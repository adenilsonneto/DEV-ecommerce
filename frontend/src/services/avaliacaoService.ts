import api from './api';
import type { Avaliacao } from '../types/avaliacao';

//busca as avaliações de um produto específico
export const getAvaliacoesPorProduto = async (produtoId: string): Promise<Avaliacao[]> => {
  const response = await api.get(`/produtos/${produtoId}/avaliacoes`);
  return response.data;
};