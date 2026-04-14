import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getProdutoById, deleteProduto } from '../services/produtoService';
import type { Produto } from '../types/produto';
import AvaliacoesProduto from '../components/produto/AvaliacoesProduto';
//componente de estrelas para exibir a nota
function Estrelas({ nota }: { nota: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((estrela) => (
        <span
          key={estrela}
          className={estrela <= nota ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function DetalhesProduto() {
  // useParams captura o :id da URL
  const { id } = useParams<{ id: string }>();
  
  // useNavigate permite navegar programaticamente
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletando, setDeletando] = useState(false);

  useEffect(() => {
    if (id) {
      carregarProduto(Number(id));
    }
  }, [id]);

  const carregarProduto = async (produtoId: number) => {
    try {
      setLoading(true);
      const data = await getProdutoById(produtoId);
      setProduto(data);
    } catch {
      setError('Produto não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async () => {
    //confirmação antes de deletar
    const confirmou = window.confirm(`Tem certeza que deseja excluir "${produto?.nome}"? Esta ação não pode ser desfeita.`);
    
    if (!confirmou || !id) return;

    try {
      setDeletando(true);
      await deleteProduto(Number(id));
      navigate('/');  // Volta ao catálogo após deletar
    } catch {
      setError('Não foi possível excluir o produto.');
      setDeletando(false);
    }
  };

  const formatarPreco = (preco: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preco);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Botão de voltar */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Voltar ao catálogo
        </Link>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {produto && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="md:flex">
              {/*iimagem */}
              <div className="md:w-1/2">
                {produto.imagem_url ? (
                  <img
                    src={produto.imagem_url}
                    alt={produto.nome}
                    className="w-full h-80 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-gray-400 text-6xl">
                    📦
                  </div>
                )}
              </div>

              {/*infos*/}
              <div className="md:w-1/2 p-6 md:p-8">
                <span className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                  {produto.categoria}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">{produto.nome}</h1>
                <p className="text-gray-600 mt-3">{produto.descricao}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Preço</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatarPreco(produto.preco)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">Estoque</span>
                    <span className={`font-semibold ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {produto.estoque > 0 ? `${produto.estoque} unidades` : 'Sem estoque'}
                    </span>
                  </div>
                </div>

                {/* ações */}
                <div className="mt-8 flex gap-3">
                  <Link
                    to={`/produtos/${id}/editar`}
                    className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={handleDeletar}
                    disabled={deletando}
                    className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
                  >
                    {deletando ? 'Excluindo...' : '🗑️ Excluir'}
                  </button>
                </div>
              </div>
            </div>

            {/*seção de avaliações */}
            <div className="border-t border-gray-100 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliações</h2>
              <AvaliacoesProduto produtoId={Number(id)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DetalhesProduto;