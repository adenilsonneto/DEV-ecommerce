//representa um produto completo vindo da API
export interface Produto{
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  imagem_url?: string; // O "?" significa que é opcional
}
//dados necessários para CRIAR um produto 
export interface ProdutoCreate{
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  imagem_url?: string;
}
//para atualizar, todos os campos são opcionais 
export interface ProdutoUpdate{
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
  categoria?: string;
  imagem_url?: string;
}
