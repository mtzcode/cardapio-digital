import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Delivery() {
  const [deliveryType, setDeliveryType] = useState(""); // "retirada" ou "entrega"
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    bairro: "",
    complemento: "",
    pagamento: "",
    troco: "",
  });
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCart(data.items || []);
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCEPBlur = async () => {
    if (!formData.cep || formData.cep.length < 8) {
      alert("Por favor, insira um CEP válido!");
      return;
    }

    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${formData.cep.replace("-", "")}/json/`
      );
      if (!response.ok) {
        throw new Error("Erro na API do CEP");
      }
      const data = await response.json();
      if (data.erro) {
        alert("CEP não encontrado!");
      } else {
        setFormData((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      alert("Erro ao buscar o endereço! Tente novamente mais tarde.");
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const extrasTotal = item.extras.reduce(
        (sum, extra) => sum + extra.price,
        0
      );
      return total + (item.prato.price + extrasTotal) * item.quantity;
    }, 0);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        deliveryType,
        name: formData.nome,
        phone: formData.telefone,
        address:
          deliveryType === "entrega"
            ? `${formData.endereco}, ${formData.numero}, ${formData.bairro}, ${formData.complemento} - CEP: ${formData.cep}`
            : "Retirada no balcão",
        cart: cart.map((item) => ({
          name: item.prato.name,
          price:
            (item.prato.price +
              item.extras.reduce((sum, extra) => sum + extra.price, 0)) *
            item.quantity,
          quantity: item.quantity,
          extras: item.extras,
        })),
        paymentMethod: formData.pagamento,
        change: formData.pagamento === "Dinheiro" ? formData.troco : null,
      };

      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Pedido enviado com sucesso!");
        window.open(data.whatsappLink, "_blank");

        // Limpar o carrinho após o pedido
        await fetch("/api/cart", {
          method: "DELETE",
        });

        router.push("/"); // Redireciona para a tela inicial
      } else {
        throw new Error("Erro ao enviar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      alert("Erro ao enviar o pedido. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Link para voltar ao carrinho */}
      <button
        onClick={() => router.push("/cart")}
        className="text-blue-500 underline mb-4"
      >
        Voltar ao Carrinho
      </button>

      <h1 className="text-2xl font-bold mb-4">Finalizar Pedido</h1>

      {/* Resumo do Pedido */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-bold mb-2">Resumo do Pedido</h2>
        {cart.map((item) => (
          <div key={item._id} className="mb-4">
            <div className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.prato.name}
              </span>
              <span>
                R${" "}
                {(
                  item.prato.price +
                  item.extras.reduce((sum, extra) => sum + extra.price, 0)
                ).toFixed(2)}
              </span>
            </div>
            {item.extras.length > 0 && (
              <ul className="text-gray-600 text-xs ml-4 mt-2">
                {item.extras.map((extra) => (
                  <li key={extra.id}>
                    - {extra.name} (R$ {extra.price.toFixed(2)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="border-t mt-4 pt-2 text-lg font-bold flex justify-between">
          <span>Total:</span>
          <span>R$ {calculateCartTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Opções de Entrega ou Retirada */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setDeliveryType("retirada")}
          className={`px-4 py-2 rounded-lg ${
            deliveryType === "retirada"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Retirada
        </button>
        <button
          onClick={() => setDeliveryType("entrega")}
          className={`px-4 py-2 rounded-lg ${
            deliveryType === "entrega"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Entrega
        </button>
      </div>

      {/* Formulários de Entrega ou Retirada */}
      {deliveryType === "retirada" || deliveryType === "entrega" ? (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div>
            <label className="block font-medium">Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Telefone:</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {deliveryType === "entrega" && (
            <>
              <div>
                <label className="block font-medium">CEP:</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCEPBlur}
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {isFetchingAddress && (
                  <p className="text-sm text-gray-500">Buscando endereço...</p>
                )}
              </div>
              <div>
                <label className="block font-medium">Endereço:</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Número:</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Bairro:</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Complemento:</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <div>
            <label className="block font-medium">Forma de Pagamento:</label>
            <select
              name="pagamento"
              value={formData.pagamento}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="Cartão">Cartão</option>
            </select>
          </div>
          {formData.pagamento === "Dinheiro" && (
            <div>
              <label className="block font-medium">Troco para:</label>
              <input
                type="text"
                name="troco"
                value={formData.troco}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">Escolha entre Retirada ou Entrega.</p>
      )}

      {/* Botão para Enviar Pedido */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        disabled={
          deliveryType === "entrega" &&
          (!formData.nome ||
            !formData.telefone ||
            !formData.cep ||
            !formData.endereco ||
            !formData.numero ||
            !formData.pagamento ||
            (formData.pagamento === "Dinheiro" && !formData.troco))
        }
      >
        Enviar Pedido
      </button>
    </div>
  );
}
