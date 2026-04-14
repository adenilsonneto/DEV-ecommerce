import { useState, useEffect } from 'react';
import Navbar from '../components/ui/Navbar';
import ProdutoCard from '../components/produto/ProdutoCard';
import Loading from '../components/ui/Loading';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getProdutos } from '../services/produtoService';
import type { Produto } from '../types/produto';

function CatalogoProdutos() {
  // estado para armazenar a lista de produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);

  //estado para controlar se está carregando
  const [loading, setLoading] = useState(true);

  // estado para armazenar mensagem de erro, se houver
  const [error, setError] = useState<string | null>(null);

  //estado para o texto da busca
  const [busca, setBusca] = useState('');

    // useState guarda dados que mudam com o tempo
  // useEffect roda quando o componente é montado pela primeira vez

  useEffect(() => {
    carregarProdutos();
  }, []);  //o [] rode apenas uma vez

  const carregarProdutos = async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProdutos(searchTerm);
      setProdutos(data);
    } catch (err) {
      setError('Não foi possível carregar os produtos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);  // Para o loading mesmo se der erro
    }
  };

  //chamada quando o usuário digita na busca
  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();  //impede o comportamento padrão do formulário
    carregarProdutos(busca);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/*cabeçalho da página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Produtos</h1>
          <p className="text-gray-500 mt-1">
            {produtos.length} produto{produtos.length !== 1 ? 's' : ''} encontrado{produtos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/*barra de busca */}
        <form onSubmit={handleBusca} className="mb-6 flex gap-2">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buscar
          </button>
          {busca && (
            <button
              type="button"
              onClick={() => { setBusca(''); carregarProdutos(); }}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Limpar
            </button>
          )}
        </form>

        {/*conteúdo condicional */}
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && produtos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-xl">Nenhum produto encontrado.</p>
          </div>
        )}

        {/*grid de produtos */}
        {!loading && !error && produtos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CatalogoProdutos;