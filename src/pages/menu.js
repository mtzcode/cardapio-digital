import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Fetch Categories and Products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const response = await fetch("/api/produtos");
        const products = await response.json();

        const uniqueCategories = [
          ...new Set(products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setMenuItems(products);
        setActiveCategory(uniqueCategories[0] || "");
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  // Fetch Cart Count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCartCount(
          (data.items || []).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          )
        );
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
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoHome}
          className="text-blue-500 font-bold text-xl hover:underline"
        >
          Página Inicial
        </button>
        <button
          onClick={handleGoToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Carrinho ({cartCount})
        </button>
      </header>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nosso Cardápio</h1>

      {/* Categories */}
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

      {/* Menu Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {menuItems
          .filter((item) => item.category === activeCategory)
          .map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition transform"
              onClick={() => handlePratoClick(item._id)}
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
