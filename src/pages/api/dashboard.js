import connectToDatabase from "utils/db";
import Order from "models/Order";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    // Conecta ao banco de dados
    await connectToDatabase();

    // Total de vendas
    const totalVendasAggregate = await Order.aggregate([
      { $unwind: "$cart" },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $toDouble: {
                $replaceAll: {
                  input: {
                    $substr: ["$cart.price", 3, -1], // Remove "R$ "
                  },
                  find: ",",
                  replacement: ".", // Substitui vírgula por ponto
                },
              },
            },
          },
        },
      },
    ]);
    const totalVendas = totalVendasAggregate[0]?.total || 0;

    // Pedidos pendentes
    const pedidosPendentes = await Order.countDocuments({ status: "Pendente" });

    // Produtos mais vendidos
    const produtosMaisVendidos = await Order.aggregate([
      { $unwind: "$cart" },
      {
        $group: {
          _id: "$cart.name",
          quantidade: { $sum: 1 },
        },
      },
      { $sort: { quantidade: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      totalVendas,
      pedidosPendentes,
      produtosMaisVendidos,
    });
  } catch (error) {
    console.error("Erro na API do dashboard:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
