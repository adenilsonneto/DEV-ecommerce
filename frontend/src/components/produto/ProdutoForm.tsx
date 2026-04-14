import { useState } from 'react';
import type { ProdutoCreate } from '../../types/produto';

interface ProdutoFormProps {
  initialData?: Partial<ProdutoCreate>;
  onSubmit: (data: ProdutoCreate) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

function ProdutoForm({ initialData, onSubmit, submitLabel, loading }: ProdutoFormProps) {
  const [formData, setFormData] = useState<ProdutoCreate>({
    id_produto: initialData?.id_produto ?? '',
    nome_produto: initialData?.nome_produto ?? '',
    categoria_produto: initialData?.categoria_produto ?? '',
    imagem_url: initialData?.imagem_url ?? '',
    media_avaliacoes: initialData?.media_avaliacoes ?? 0,
    total_vendas: initialData?.total_vendas ?? 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProdutoCreate, string>>>({});

  const handleChange = (field: keyof ProdutoCreate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validar = (): boolean => {
    const novosErros: Partial<Record<keyof ProdutoCreate, string>> = {};

    if (!formData.nome_produto.trim()) novosErros.nome_produto = 'Nome é obrigatório';
    if (!formData.categoria_produto.trim()) novosErros.categoria_produto = 'Categoria é obrigatória';

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Campo Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Produto *
        </label>
        <input
          type="text"
          value={formData.nome_produto}
          onChange={(e) => handleChange('nome_produto', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nome_produto ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="Ex: Camiseta Básica Azul"
        />
        {errors.nome_produto && <p className="text-red-500 text-sm mt-1">{errors.nome_produto}</p>}
      </div>

      {/* Campo Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <input
          type="text"
          value={formData.categoria_produto}
          onChange={(e) => handleChange('categoria_produto', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.categoria_produto ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="Ex: Vestuário, Eletrônicos..."
        />
        {errors.categoria_produto && <p className="text-red-500 text-sm mt-1">{errors.categoria_produto}</p>}
      </div>

      {/* Campo URL da Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL da Imagem
        </label>
        <input
          type="url"
          value={formData.imagem_url ?? ''}
          onChange={(e) => handleChange('imagem_url', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-all"
      >
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}

export default ProdutoForm;