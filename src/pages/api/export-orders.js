import connectToDatabase from "../../utils/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Conecta ao banco de dados
      await connectToDatabase();

      // Obtém todos os pedidos do banco de dados
      const orders = await Order.find();

      // Verifica se há pedidos
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "Nenhum pedido encontrado." });
      }

      // Monta o conteúdo do arquivo CSV
      const csvHeader = "Nome,Telefone,Endereço,Forma de Pagamento,Total\n";
      const csvBody = orders
        .map((order) => {
          const total = order.cart.reduce(
            (sum, item) =>
              sum +
              (item.prato.price +
                item.extras.reduce(
                  (extraSum, extra) => extraSum + extra.price,
                  0
                )) *
                item.quantity,
            0
          );

          return `"${order.name}","${order.phone}","${order.address}","${
            order.paymentMethod
          }","R$ ${total.toFixed(2)}"`;
        })
        .join("\n");

      const csvContent = csvHeader + csvBody;

      // Configura o cabeçalho da resposta para download do arquivo
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="pedidos.csv"'
      );

      res.status(200).send(csvContent);
    } catch (error) {
      console.error("Erro ao exportar pedidos:", error);
      res.status(500).json({ error: "Erro ao exportar pedidos." });
    }
  } else {
    // Método não permitido
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Método ${req.method} não permitido.`);
  }
}
