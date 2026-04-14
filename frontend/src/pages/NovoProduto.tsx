import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProdutoForm from '../components/produto/ProdutoForm';
import { createProduto } from '../services/produtoService';
import type { ProdutoCreate } from '../types/produto';

function NovoProduto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProdutoCreate) => {
    try {
      setLoading(true);
      setError(null);
      const novoProduto = await createProduto(data);
      
      //redireciona para os detalhes do produto que acabou de ser criado
      navigate(`/produtos/${novoProduto.id_produto}`);
    } catch {
      setError('Não foi possível criar o produto. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Produto</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <ProdutoForm
            onSubmit={handleSubmit}
            submitLabel="Criar Produto"
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}

export default NovoProduto;