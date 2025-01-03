import { useState, useEffect } from "react";

export default function GerenciarCategorias() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Fetch categorias do backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categorias");
        if (!response.ok) {
          throw new Error("Erro ao buscar categorias");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Digite um nome para a categoria");
      return;
    }

    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        const savedCategory = await response.json();
        setCategories((prevCategories) => [
          ...prevCategories,
          savedCategory.name,
        ]);
        setNewCategory("");
      } else {
        alert("Erro ao adicionar categoria");
      }
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${category}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/categorias?name=${encodeURIComponent(category)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat !== category)
        );
      } else {
        alert("Erro ao excluir categoria");
      }
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Categorias</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nova Categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border px-4 py-2 rounded-md w-full sm:w-auto"
          />
          <button
            onClick={handleAddCategory}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Nova Categoria
          </button>
        </div>
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
