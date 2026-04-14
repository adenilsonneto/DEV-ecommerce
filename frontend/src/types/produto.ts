//representa um produto completo vindo da API
export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?: string;
  media_avaliacoes: number;
  total_vendas: number;
} // O "?" significa que é opcional

//dados necessários para CRIAR um produto 
export interface ProdutoCreate{
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?: string;
  media_avaliacoes: number;
  total_vendas: number;
}
//para atualizar, todos os campos são opcionais 
export interface ProdutoUpdate{
    id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  imagem_url?: string;
  media_avaliacoes: number;
  total_vendas: number;
}
