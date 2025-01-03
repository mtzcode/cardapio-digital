import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          menuOpen ? "fixed md:relative" : "fixed md:relative md:translate-x-0"
        } ${
          menuOpen ? "left-0" : "-left-full"
        } md:left-0 md:w-64 w-64 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col shadow-lg transition-all duration-300 z-50 full-height`}
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

        {/* Logout Button */}
        <div className="mt-auto p-4">
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-4 bg-blue-600 rounded-full text-white fixed bottom-4 right-4 md:hidden shadow-lg z-50"
      >
        ☰
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-lg md:ml-64">
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
