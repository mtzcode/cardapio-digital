import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Dados simulados para categorias e itens
const categories = ["Entradas", "Pratos Principais", "Sobremesas", "Bebidas"];
const menuItems = [
  {
    id: 1,
    category: "Entradas",
    name: "Bruschetta",
    description: "Fatias de pão tostado com tomate, manjericão e azeite.",
    price: 12.99,
    image: "/images/bruschetta.jpg",
  },
  {
    id: 2,
    category: "Entradas",
    name: "Tábua de Queijos",
    description: "Uma seleção de queijos finos com acompanhamentos.",
    price: 22.99,
    image: "/images/queijos.jpg",
  },
  {
    id: 3,
    category: "Pratos Principais",
    name: "Risoto de Camarão",
    description: "Arroz cremoso com camarões frescos e ervas.",
    price: 49.99,
    image: "/images/risoto.jpg",
  },
  {
    id: 4,
    category: "Pratos Principais",
    name: "Filet Mignon ao Molho Madeira",
    description: "Filet mignon com molho madeira e purê de batatas.",
    price: 59.99,
    image: "/images/filet.jpg",
  },
  {
    id: 5,
    category: "Sobremesas",
    name: "Petit Gâteau",
    description: "Bolo quente com recheio de chocolate e sorvete de creme.",
    price: 19.99,
    image: "/images/petit-gateau.jpg",
  },
  {
    id: 6,
    category: "Sobremesas",
    name: "Torta de Limão",
    description: "Torta doce de limão com massa crocante.",
    price: 14.99,
    image: "/images/torta-limao.jpg",
  },
  {
    id: 7,
    category: "Bebidas",
    name: "Suco de Laranja Natural",
    description: "Suco de laranja fresco, sem adição de açúcar.",
    price: 7.99,
    image: "/images/suco-laranja.jpg",
  },
  {
    id: 8,
    category: "Bebidas",
    name: "Cerveja Artesanal",
    description: "Cerveja artesanal local, sabor único.",
    price: 12.99,
    image: "/images/cerveja.jpg",
  },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [cartCount, setCartCount] = useState(0); // Contagem de itens no carrinho
  const router = useRouter();

  // Recupera o carrinho da API ou localStorage
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0)); // Soma as quantidades
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
      }
    };

    fetchCartCount();
  }, []);

  const handlePratoClick = (id) => {
    router.push(`/prato/${id}`);
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-6">
        {/* Link para voltar à página inicial */}
        <button
          onClick={handleGoHome}
          className="text-blue-500 font-bold text-xl hover:underline"
        >
          Página Inicial
        </button>

        {/* Botão do Carrinho */}
        <button
          onClick={handleGoToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Carrinho ({cartCount})
        </button>
      </header>

      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nosso Cardápio</h1>

      {/* Categorias */}
      <div className="overflow-x-auto">
        <div className="flex justify-start gap-4 mb-6 w-max px-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${
                category === activeCategory
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Itens do Cardápio */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {menuItems
          .filter((item) => item.category === activeCategory)
          .map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition transform"
              onClick={() => handlePratoClick(item.id)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-2">
                <h2 className="text-sm font-bold text-gray-800">{item.name}</h2>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                <p className="text-sm font-semibold text-blue-500 mt-2">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
