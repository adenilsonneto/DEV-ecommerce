import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import ProdutoForm from '../components/produto/ProdutoForm';
import Loading from '../components/ui/Loading';
import { getProdutoById, updateProduto } from '../services/produtoService';
import type { Produto, ProdutoCreate } from '../types/produto';

function EditarProduto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loadingProduto, setLoadingProduto] = useState(true);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getProdutoById(Number(id))
        .then(setProduto)
        .catch(() => setError('Produto não encontrado.'))
        .finally(() => setLoadingProduto(false));
    }
  }, [id]);

  const handleSubmit = async (data: ProdutoCreate) => {
    if (!id) return;
    try {
      setLoadingSalvar(true);
      await updateProduto(Number(id), data);
      navigate(`/produtos/${id}`);
    } catch {
      setError('Não foi possível salvar as alterações.');
      setLoadingSalvar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to={`/produtos/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Voltar ao produto
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Produto</h1>

        {loadingProduto && <Loading />}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {produto && !loadingProduto && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/*passa os dados atuais como initialData para pré-preencher o formulário */}
            <ProdutoForm
              initialData={produto}
              onSubmit={handleSubmit}
              submitLabel="Salvar Alterações"
              loading={loadingSalvar}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default EditarProduto;