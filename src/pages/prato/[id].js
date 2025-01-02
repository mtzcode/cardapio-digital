import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Dados simulados (use uma API real no futuro)
const menuItems = [
  {
    id: 1,
    name: "Bruschetta",
    description: "Fatias de pão tostado com tomate, manjericão e azeite.",
    price: 12.99,
    extras: [
      { id: "1", name: "Azeitonas", price: 2.99 },
      { id: "2", name: "Queijo extra", price: 3.99 },
    ],
  },
  {
    id: 2,
    name: "Tábua de Queijos",
    description: "Uma seleção de queijos finos com acompanhamentos.",
    price: 22.99,
    extras: [
      { id: "3", name: "Geleia de Pimenta", price: 4.99 },
      { id: "4", name: "Castanhas", price: 3.49 },
    ],
  },
  {
    id: 3,
    name: "Risoto de Camarão",
    description: "Arroz cremoso com camarões frescos e ervas.",
    price: 49.99,
    extras: [
      { id: "5", name: "Parmesão Ralado", price: 5.99 },
      { id: "6", name: "Camarões Extras", price: 9.99 },
    ],
  },
];

export default function Prato() {
  const router = useRouter();
  const { id, edit, cartId } = router.query;

  const [prato, setPrato] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);

  useEffect(() => {
    if (id) {
      const pratoEncontrado = menuItems.find((p) => p.id === parseInt(id));
      if (pratoEncontrado) {
        setPrato(pratoEncontrado);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchCartItem = async () => {
      if (edit && cartId) {
        const response = await fetch(`/api/cart`);
        const data = await response.json();
        const cartItem = data.items.find((item) => item._id === cartId);

        if (cartItem) {
          setQuantity(cartItem.quantity);
          setSelectedExtras(cartItem.extras.map((extra) => extra.id));
        }
      }
    };

    fetchCartItem();
  }, [edit, cartId]);

  const handleSave = async () => {
    const updatedItem = {
      prato: {
        id: prato.id,
        name: prato.name,
        price: prato.price,
      },
      extras: prato.extras.filter((extra) => selectedExtras.includes(extra.id)),
      quantity,
    };

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: updatedItem, cartId }),
      });

      if (response.ok) {
        alert(
          edit ? "Item atualizado com sucesso!" : "Item adicionado ao carrinho!"
        );
        router.push(edit ? "/cart" : "/menu");
      } else {
        throw new Error("Erro ao salvar o item.");
      }
    } catch (error) {
      console.error("Erro ao salvar o item:", error);
      alert("Erro ao salvar o item!");
    }
  };

  if (!prato) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={() => router.push(edit ? "/cart" : "/menu")}
        className="text-blue-500 underline mb-4"
      >
        {edit ? "Voltar ao Carrinho" : "Voltar ao Menu"}
      </button>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800">{prato.name}</h1>
        <p className="text-gray-600 mt-2">{prato.description}</p>
        <p className="text-lg font-semibold text-blue-500 mt-4">
          R$ {prato.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Acréscimos</h2>
        <ul className="mt-2">
          {prato.extras.map((extra) => (
            <li key={extra.id} className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id={`extra-${extra.id}`}
                checked={selectedExtras.includes(extra.id)}
                onChange={() => {
                  setSelectedExtras((prev) =>
                    prev.includes(extra.id)
                      ? prev.filter((id) => id !== extra.id)
                      : [...prev, extra.id]
                  );
                }}
                className="h-4 w-4"
              />
              <label htmlFor={`extra-${extra.id}`} className="text-gray-700">
                {extra.name} (+ R$ {extra.price.toFixed(2)})
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800">Quantidade</h2>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        {edit ? "Salvar" : "Adicionar ao Carrinho"}
      </button>
    </div>
  );
}
