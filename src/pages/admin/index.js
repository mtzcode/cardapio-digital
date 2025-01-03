import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    pendingOrders: 0,
    totalClients: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        setDashboardData({
          totalSales: data.totalVendas || 0,
          pendingOrders: data.pedidosPendentes || 0,
          totalClients: data.totalClientes || 0,
          totalProducts: data.totalProdutos || 0,
          recentOrders: data.pedidosRecentes || [],
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-center text-xl text-gray-600">Carregando...</p>
      </AdminLayout>
    );
  }

  const {
    totalSales,
    pendingOrders,
    totalClients,
    totalProducts,
    recentOrders,
  } = dashboardData;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>

        {/* Cards Resumidos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Total de Vendas
            </h2>
            <p className="text-2xl font-bold text-green-600">
              R$ {totalSales.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Pedidos Pendentes
            </h2>
            <p className="text-2xl font-bold text-yellow-500">
              {pendingOrders}
            </p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Total de Clientes
            </h2>
            <p className="text-2xl font-bold text-blue-500">{totalClients}</p>
          </div>
          <div className="p-4 bg-white shadow rounded-lg text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Total de Produtos
            </h2>
            <p className="text-2xl font-bold text-purple-600">
              {totalProducts}
            </p>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Vendas Recentes
          </h2>
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <p>Gráfico de Vendas (Placeholder)</p>
          </div>
        </div>

        {/* Pedidos Recentes */}
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Pedidos Recentes
          </h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2 px-4 text-left">Cliente</th>
                <th className="border-b py-2 px-4 text-left">Valor</th>
                <th className="border-b py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index}>
                  <td className="border-b py-2 px-4">{order.cliente}</td>
                  <td className="border-b py-2 px-4">
                    R$ {order.valor.toFixed(2)}
                  </td>
                  <td
                    className={`border-b py-2 px-4 ${
                      order.status === "Concluído"
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
