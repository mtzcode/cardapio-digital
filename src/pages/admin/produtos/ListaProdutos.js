import { useState, useEffect } from "react";

export default function ListaProdutos({ onEditProduct }) {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch produtos from API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/api/produtos");
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };
    fetchProdutos();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory ? produto.category === selectedCategory : true)
  );

  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProdutos.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await fetch(`/api/produtos?id=${id}`, { method: "DELETE" });
        setProdutos(produtos.filter((produto) => produto._id !== id));
        alert("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nome,Categoria,Preço"]
        .concat(
          produtos.map((p) => `${p.name},${p.category},${p.price.toFixed(2)}`)
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "produtos.csv");
    link.click();
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      {/* Barra de pesquisa e filtros */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={handleSearch}
            className="border px-4 py-2 rounded-md w-full sm:w-auto"
          />
          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="border px-4 py-2 rounded-md w-full sm:w-auto"
          >
            <option value="">Todas as Categorias</option>
            <option value="Entradas">Entradas</option>
            <option value="Pratos Principais">Pratos Principais</option>
            {/* Outras categorias */}
          </select>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Exportar CSV
        </button>
      </div>

      {/* Tabela de produtos */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left text-sm sm:text-base">
                Nome
              </th>
              <th className="border px-4 py-2 text-left text-sm sm:text-base">
                Categoria
              </th>
              <th className="border px-4 py-2 text-left text-sm sm:text-base">
                Preço
              </th>
              <th className="border px-4 py-2 text-center text-sm sm:text-base">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProdutos.map((produto) => (
              <tr key={produto._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-sm sm:text-base font-bold">
                  {produto.name}
                </td>
                <td className="border px-4 py-2 text-sm sm:text-base">
                  {produto.category}
                </td>
                <td className="border px-4 py-2 text-sm sm:text-base">
                  R$ {produto.price.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => onEditProduct(produto)}
                    className="hidden sm:inline-block bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <span
                    onClick={() => onEditProduct(produto)}
                    className="sm:hidden text-yellow-500 cursor-pointer text-sm underline"
                  >
                    Editar
                  </span>
                  <button
                    onClick={() => handleDelete(produto._id)}
                    className="hidden sm:inline-block bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                  <span
                    onClick={() => handleDelete(produto._id)}
                    className="sm:hidden text-red-500 cursor-pointer text-sm underline"
                  >
                    Excluir
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <p className="text-sm sm:text-base">
          Página {currentPage} de {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
