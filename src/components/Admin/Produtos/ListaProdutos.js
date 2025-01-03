function ListaProdutos() {
  const [products, setProducts] = useState([
    {
      id: 1,
      category: "Entradas",
      name: "Bruschetta",
      description: "Fatias de pão tostado com tomate, manjericão e azeite.",
      price: 12.99,
      image: "/images/bruschetta.jpg",
    },
    // Outros produtos...
  ]);

  const handleAddProduct = () => {
    // Função para adicionar novo produto
  };

  const handleEditProduct = (id) => {
    // Função para editar produto
  };

  const handleDeleteProduct = (id) => {
    // Função para excluir produto
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Botão para cadastrar novo produto */}
      <div className="flex justify-end">
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Cadastrar Novo Produto
        </button>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col space-y-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded"
            />
            <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-bold">
              R$ {product.price.toFixed(2)}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEditProduct(product.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
