import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <h1 className="text-2xl font-bold text-center p-4">Admin Panel</h1>
      <nav className="flex flex-col gap-4 px-4">
        <Link href="/admin">
          <span className="block py-2 px-4 rounded hover:bg-gray-700">
            Principal
          </span>
        </Link>
        <Link href="/admin/produtos">
          <span className="block py-2 px-4 rounded hover:bg-gray-700">
            Produtos
          </span>
        </Link>
        <Link href="/admin/pedidos">
          <span className="block py-2 px-4 rounded hover:bg-gray-700">
            Pedidos
          </span>
        </Link>
        <Link href="/admin/configuracoes">
          <span className="block py-2 px-4 rounded hover:bg-gray-700">
            Configurações
          </span>
        </Link>
      </nav>
    </div>
  );
}
