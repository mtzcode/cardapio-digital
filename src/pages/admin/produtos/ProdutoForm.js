import { useState, useEffect } from "react";

export default function ProdutoForm({ onSave, product = {} }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(product.category || "");
  const [image, setImage] = useState(product.image || "default-image.jpg");
  const [imagePreview, setImagePreview] = useState(product.image || null);
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [measure, setMeasure] = useState(product.measure || "g");
  const [quantity, setQuantity] = useState(product.quantity || "");
  const [extras, setExtras] = useState(product.extras || []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categorias");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddExtra = () => {
    setExtras([...extras, { name: "", price: "" }]);
  };

  const handleRemoveExtra = (index) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const handleExtraChange = (index, field, value) => {
    const updatedExtras = [...extras];
    updatedExtras[index][field] = value;
    setExtras(updatedExtras);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = image;
    if (image instanceof File) {
      const formData = new FormData();
      formData.append("file", image);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        imageUrl = data.url || "default-image.jpg";
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }

    const productData = {
      _id: product._id, // Use o ID do produto se estiver editando
      image: imageUrl,
      name,
      category,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      measure,
      extras,
    };

    try {
      const method = product._id ? "PUT" : "POST";
      const response = await fetch("/api/produtos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Produto salvo com sucesso!");
        onSave(productData); // Chama a função passada pelo componente pai
      } else {
        alert("Erro ao salvar o produto.");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar o produto. Tente novamente.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {product._id ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Imagem do Produto</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full border rounded p-2"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Previsualização"
              className="w-32 h-32 mt-2 object-cover"
            />
          )}
        </div>
        <div>
          <label className="block font-bold mb-1">Nome do Produto</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="w-full border rounded p-2"
          ></textarea>
        </div>
        <div>
          <label className="block font-bold mb-1">Preço de Venda</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block font-bold mb-1">Quantidade</label>
            <input
              type="number"
              value={quantity}
              placeholder="Ex: 500"
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Unidade</label>
            <select
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              required
              className="w-full border rounded p-2"
            >
              <option value="g">Gramas (g)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="kg">Quilogramas (kg)</option>
              <option value="lt">Litros (lt)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block font-bold mb-1">Acréscimos</label>
          {extras.map((extra, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                type="text"
                value={extra.name}
                onChange={(e) =>
                  handleExtraChange(index, "name", e.target.value)
                }
                placeholder="Nome do Acréscimo"
                required
                className="w-1/2 border rounded p-2"
              />
              <input
                type="number"
                value={extra.price}
                onChange={(e) =>
                  handleExtraChange(index, "price", e.target.value)
                }
                placeholder="Preço"
                required
                step="0.01"
                className="w-1/3 border rounded p-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveExtra(index)}
                className="text-red-500 font-bold hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExtra}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Adicionar Acréscimo
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
