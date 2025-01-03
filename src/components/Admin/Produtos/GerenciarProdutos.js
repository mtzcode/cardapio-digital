function GerenciarCategorias() {
  const [categories, setCategories] = useState([
    "Entradas",
    "Pratos Principais",
    "Sobremesas",
    "Bebidas",
  ]);

  const handleAddCategory = () => {
    // Função para adicionar categoria
  };

  const handleDeleteCategory = (category) => {
    // Função para excluir categoria
    setCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <div className="space-y-6">
      {/* Botão para adicionar categoria */}
      <div className="flex justify-end">
        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Adicionar Categoria
        </button>
      </div>

      {/* Lista de Categorias */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Categorias</h2>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
            >
              <span>{category}</span>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-500 hover:underline"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
