import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Admin() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!session) return; // Evita buscar dados antes da autenticação
    async function fetchOrders() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page,
          limit,
          search,
          status: statusFilter,
        }).toString();

        const response = await fetch(`/api/orders?${query}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar pedidos");
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao buscar pedidos.");
        setLoading(false);
      }
    }

    fetchOrders();
  }, [page, search, statusFilter, session]);

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      const data = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: data.order.status } : order
        )
      );

      toast.success(`Status atualizado para "${newStatus}" com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status.");
    }
  };

  const exportOrders = async () => {
    try {
      const response = await fetch("/api/export-orders");
      if (!response.ok) {
        throw new Error("Erro ao exportar pedidos");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedidos.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Pedidos exportados com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar pedidos:", error);
      toast.error("Erro ao exportar pedidos.");
    }
  };

  if (status === "loading") return <p>Carregando...</p>;
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="mb-4 text-lg">
          Você precisa estar autenticado para acessar esta página.
        </p>
        <button
          onClick={() => signIn()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="mb-4 flex justify-between">
        <div>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded ml-2"
          >
            <option value="">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em preparação">Em preparação</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>
        <button
          onClick={exportOrders}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar CSV
        </button>
      </div>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Nome</th>
                <th className="border p-2">Telefone</th>
                <th className="border p-2">Endereço</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="border p-2">{order.name}</td>
                  <td className="border p-2">{order.phone}</td>
                  <td className="border p-2">{order.address}</td>
                  <td className="border p-2">
                    <select
                      value={order.status || "Pendente"}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em preparação">Em preparação</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <p>
              Página {page} de {totalPages}
            </p>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </main>
  );
}
