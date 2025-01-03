import AdminLayout from "../../components/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600">
          Resumo das principais métricas e informações do sistema.
        </p>
      </div>
    </AdminLayout>
  );
}
