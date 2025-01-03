import { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import ProdutoForm from "./ProdutoForm";
import ListaProdutos from "./ListaProdutos";
import GerenciarCategorias from "./GerenciarCategorias";

export default function Produtos() {
  const [activeTab, setActiveTab] = useState("produtos"); // Abas: 'produtos' ou 'categorias'
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null); // Limpa qualquer produto sendo editado
    setShowForm(true); // Exibe o formulário
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product); // Define o produto para edição
    setShowForm(true); // Exibe o formulário
  };

  const handleSaveProduct = (productData) => {
    console.log("Produto salvo:", productData);
    setShowForm(false); // Oculta o formulário após salvar
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            Gerenciamento de Produtos
          </h1>
          {!showForm && activeTab === "produtos" && (
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Cadastrar Novo Produto
            </button>
          )}
        </div>

        {/* Tabs para alternar entre Produtos e Categorias */}
        {!showForm && (
          <div className="flex space-x-4 border-b pb-2">
            <button
              onClick={() => setActiveTab("produtos")}
              className={`px-4 py-2 ${
                activeTab === "produtos"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Lista de Produtos
            </button>
            <button
              onClick={() => setActiveTab("categorias")}
              className={`px-4 py-2 ${
                activeTab === "categorias"
                  ? "border-b-2 border-blue-600 text-blue-600 font-bold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Categorias
            </button>
          </div>
        )}

        {/* Conteúdo Dinâmico */}
        <div>
          {showForm ? (
            <ProdutoForm
              onSave={handleSaveProduct}
              product={editingProduct || {}} // Preenche o formulário com o produto em edição ou vazio
              onCancel={() => setShowForm(false)} // Adiciona a funcionalidade de cancelar
            />
          ) : activeTab === "produtos" ? (
            <ListaProdutos onEditProduct={handleEditProduct} />
          ) : (
            <GerenciarCategorias />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
