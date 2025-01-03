import AdminLayout from "../../../components/AdminLayout";

export default function Produtos() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Gestão de Produtos
        </h1>
        <p className="text-gray-600">
          Gerencie os itens disponíveis para seus clientes.
        </p>
      </div>
    </AdminLayout>
  );
}
