import { useState } from 'react';
import type { ProdutoCreate } from '../../types/produto';

interface ProdutoFormProps {
  //dados iniciais para edição ou criação
  initialData?: Partial<ProdutoCreate>;
  
  //função chamada quando o formulário é enviado
  onSubmit: (data: ProdutoCreate) => Promise<void>;
  
  //texto do botão de submit
  submitLabel: string;
  
  //Estado de carregamento externo
  loading?: boolean;
}

function ProdutoForm({ initialData, onSubmit, submitLabel, loading }: ProdutoFormProps) {
  const [formData, setFormData] = useState<ProdutoCreate>({
    nome: initialData?.nome ?? '',
    descricao: initialData?.descricao ?? '',
    preco: initialData?.preco ?? 0,
    estoque: initialData?.estoque ?? 0,
    categoria: initialData?.categoria ?? '',
    imagem_url: initialData?.imagem_url ?? '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProdutoCreate, string>>>({});

  //atualiza um campo específico do formulário
  const handleChange = (field: keyof ProdutoCreate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    //remove o erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  //validação simples antes de enviar
  const validar = (): boolean => {
    const novosErros: Partial<Record<keyof ProdutoCreate, string>> = {};

    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    if (formData.preco <= 0) novosErros.preco = 'Preço deve ser maior que zero';
    if (formData.estoque < 0) novosErros.estoque = 'Estoque não pode ser negativo';
    if (!formData.categoria.trim()) novosErros.categoria = 'Categoria é obrigatória';

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
      {/*Campo Nome */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Produto *
        </label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nome ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="Ex: Camiseta Básica Azul"
        />
        {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
      </div>

      {/*Campo Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.descricao ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="Descreva o produto..."
        />
        {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
      </div>

      {/*campos Preço e Estoque*/}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$) *
          </label>
          <input
            type="number"
            value={formData.preco}
            onChange={(e) => handleChange('preco', Number(e.target.value))}
            min="0"
            step="0.01"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.preco ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.preco && <p className="text-red-500 text-sm mt-1">{errors.preco}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque *
          </label>
          <input
            type="number"
            value={formData.estoque}
            onChange={(e) => handleChange('estoque', Number(e.target.value))}
            min="0"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.estoque ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.estoque && <p className="text-red-500 text-sm mt-1">{errors.estoque}</p>}
        </div>
      </div>

      {/*campo Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <input
          type="text"
          value={formData.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.categoria ? 'border-red-400' : 'border-gray-300'
          }`}
          placeholder="Ex: Vestuário, Eletrônicos..."
        />
        {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
      </div>

      {/*campo URL da Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL da Imagem
        </label>
        <input
          type="url"
          value={formData.imagem_url}
          onChange={(e) => handleChange('imagem_url', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : submitLabel}
      </button>
    </form>
  );
}

export default ProdutoForm;