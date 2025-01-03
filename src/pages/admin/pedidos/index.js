import AdminLayout from "../../../components/AdminLayout";

export default function Pedidos() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Gerenciamento de Pedidos
        </h1>
        <p className="text-gray-600">
          Controle e atualize o status dos pedidos recebidos.
        </p>
      </div>
    </AdminLayout>
  );
}
