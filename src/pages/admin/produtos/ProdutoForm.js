import { useState } from "react";

export default function ProdutoForm({ onSave, product = {} }) {
  const [image, setImage] = useState(product.image || null);
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price || "");
  const [measure, setMeasure] = useState(product.measure || "g");
  const [quantity, setQuantity] = useState(product.quantity || "500");
  const [extras, setExtras] = useState(product.extras || []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      image,
      name,
      description,
      price,
      quantity,
      measure,
      extras,
    };
    onSave(productData);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        {product.id ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Imagem do Produto</label>
          <input
            type="file"
            accept="image/jpeg"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded p-2"
          />
          {image && (
            <p className="text-gray-500 mt-1">
              {typeof image === "string" ? image : image.name}
            </p>
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
