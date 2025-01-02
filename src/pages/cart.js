import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir item do carrinho");
      }
    } catch (error) {
      console.error("Erro ao remover o item:", error);
      alert("Erro ao remover o item!");
    }
  };

  const handleEditItem = (item) => {
    router.push(`/prato/${item.prato.id}?edit=true&cartId=${item._id}`);
  };

  const handleProceedToDelivery = () => {
    router.push("/delivery"); // Direciona corretamente para a página de Delivery
  };

  const calculateItemTotal = (item) => {
    const extrasTotal = item.extras.reduce(
      (sum, extra) => sum + extra.price,
      0
    );
    return (item.prato.price + extrasTotal) * item.quantity;
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  if (loading) {
    return <p>Carregando carrinho...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Link para voltar ao menu */}
      <button
        onClick={() => router.push("/menu")}
        className="text-blue-500 underline mb-6"
      >
        Voltar ao Menu
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Carrinho</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {item.prato.name}
                </h2>
                <p className="text-sm text-gray-600">
                  Quantidade: {item.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Acréscimos:{" "}
                  {item.extras && item.extras.length > 0
                    ? item.extras.map((extra) => extra.name).join(", ")
                    : "Nenhum"}
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  Total: R$ {calculateItemTotal(item).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Links para editar e remover */}
                <span
                  onClick={() => handleEditItem(item)}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Editar
                </span>
                <span
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500 underline cursor-pointer"
                >
                  Remover
                </span>
              </div>
            </div>
          ))}

          {/* Exibição do valor total */}
          <div className="text-lg font-bold text-gray-800 flex justify-between mt-4 border-t pt-4">
            <span>Total do Pedido:</span>
            <span>R$ {calculateCartTotal().toFixed(2)}</span>
          </div>

          {/* Botão para Finalizar Pedido */}
          <button
            onClick={handleProceedToDelivery}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mt-6"
          >
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
