import { useState, useEffect } from 'react';
import { getAvaliacoesPorProduto } from '../../services/avaliacaoService';
import type { Avaliacao } from '../../types/avaliacao';

interface AvaliacoesProdutoProps {
  produtoId: string; // ✅ string
}

function Estrelas({ nota, tamanho = 'md' }: { nota: number; tamanho?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' };
  return (
    <div className={`flex gap-0.5 ${sizes[tamanho]}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(nota) ? 'text-yellow-400' : 'text-gray-200'}>
          ★
        </span>
      ))}
    </div>
  );
}

function AvaliacoesProduto({ produtoId }: AvaliacoesProdutoProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAvaliacoesPorProduto(produtoId) // ✅ string, sem Number()
      .then(setAvaliacoes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [produtoId]);

  // Calcula a média das notas usando o campo correto "avaliacao"
  const media = avaliacoes.length
    ? avaliacoes.reduce((sum, a) => sum + a.avaliacao, 0) / avaliacoes.length // ✅ a.avaliacao
    : 0;

  if (loading) return <p className="text-gray-400 text-sm">Carregando avaliações...</p>;

  return (
    <div>
      {/* Resumo da média */}
      {avaliacoes.length > 0 && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-yellow-50 rounded-xl">
          <div>
            <div className="text-4xl font-bold text-gray-900">{media.toFixed(1)}</div>
            <div>
              <Estrelas nota={media} tamanho="lg" />
              <p className="text-sm text-gray-500 mt-1">
                Baseado em {avaliacoes.length} {avaliacoes.length !== 1 ? 'avaliações' : 'avaliação'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de avaliações */}
      {avaliacoes.length === 0 ? (
        <p className="text-gray-400">Este produto ainda não possui avaliações.</p>
      ) : (
        <div className="space-y-4">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id_avaliacao} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Estrelas nota={avaliacao.avaliacao} tamanho="sm" /> {/* ✅ avaliacao.avaliacao */}
                <span className="text-xs text-gray-400">
                    {avaliacao.data_comentario 
                    ? new Date(avaliacao.data_comentario).toLocaleDateString('pt-BR')
                     : ''}
                </span>
              </div>
              {avaliacao.comentario && (
                <p className="text-gray-600 text-sm">{avaliacao.comentario}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AvaliacoesProduto;