import AdminLayout from "../../../components/AdminLayout";

export default function Configuracoes() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Configurações do Sistema
        </h1>
        <p className="text-gray-600">
          Personalize as configurações e dados da sua empresa.
        </p>
      </div>
    </AdminLayout>
  );
}
