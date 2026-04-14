import { Link } from 'react-router-dom';
import type { Produto } from '../../types/produto';

interface ProdutoCardProps {
  produto: Produto;
}

//formata número para moeda brasileira: 49.9 → "R$ 49,90"
const formatarPreco = (preco: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco);
};

function ProdutoCard({ produto }: ProdutoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/*imagem do produto */}
      {produto.imagem_url ? (
        <img
          src={produto.imagem_url}
          alt={produto.nome_produto}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          Sem imagem
        </div>
      )}

      <div className="p-4">
        <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
          {produto.categoria_produto}
        </span>
        <h3 className="text-gray-900 font-semibold text-lg mt-1 truncate">
          {produto.nome_produto}
        </h3>

        {/*botão que leva aos detalhes */}
        <Link
          to={`/produtos/${produto.id_produto}`}
          className="mt-3 block w-full text-center bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

export default ProdutoCard;