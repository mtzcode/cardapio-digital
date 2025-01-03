import { useState } from "react";

export default function GerenciarCategorias() {
  const [categories, setCategories] = useState([
    "Entradas",
    "Pratos Principais",
    "Sobremesas",
    "Bebidas",
  ]);

  const handleAddCategory = () => {
    console.log("Abrir modal ou redirecionar para cadastrar nova categoria");
  };

  const handleDeleteCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Categorias</h2>
        <button
          onClick={handleAddCategory}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Nova Categoria
        </button>
      </div>
      <ul className="space-y-4">
        {categories.map((category, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-md"
          >
            <span className="text-gray-800 font-semibold">{category}</span>
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
  );
}
