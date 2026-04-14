//spinner de carregamento exibido enquanto aguarda a API
function Loading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <span className="ml-3 text-gray-600">Carregando...</span>
    </div>
  );
}

export default Loading;

