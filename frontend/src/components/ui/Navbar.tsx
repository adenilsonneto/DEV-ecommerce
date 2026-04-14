import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo/nome clicável que volta ao catálogo */}
        <Link to="/" className="text-xl font-bold text-blue-700 hover:text-blue-800">
          🛒 E-Commerce Manager
        </Link>

        <div className="flex gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Catálogo
          </Link>
          <Link
            to="/produtos/novo"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Novo Produto
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;