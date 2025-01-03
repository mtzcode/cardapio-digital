import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { name: "Principal", path: "/admin" },
    { name: "Produtos", path: "/admin/produtos" },
    { name: "Pedidos", path: "/admin/pedidos" },
    { name: "Configurações", path: "/admin/configuracoes" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative ${
          menuOpen ? "left-0" : "-left-full"
        } top-0 h-full w-64 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col shadow-lg transition-all duration-300 z-50`}
      >
        <div className="p-4 font-bold text-lg flex justify-between items-center">
          <span>Administração</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 bg-blue-700 hover:bg-blue-800 rounded-full focus:outline-none md:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} legacyBehavior>
              <a
                className={`p-3 mx-2 rounded-lg flex items-center gap-3 ${
                  router.pathname === item.path
                    ? "bg-blue-700 shadow-md"
                    : "hover:bg-blue-600"
                }`}
              >
                <span>{item.name}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-4 bg-blue-600 rounded-full text-white fixed bottom-4 right-4 md:hidden shadow-lg z-50"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-lg mt-16 md:mt-0 md:ml-64">
        {children || (
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
              Bem-vindo ao Painel Admin
            </h1>
            <p className="text-gray-600">
              Use o menu à esquerda para navegar nas opções administrativas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
