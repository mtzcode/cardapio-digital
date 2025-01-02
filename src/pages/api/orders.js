import connectToDatabase from "../../utils/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();

      const { page = 1, limit = 10, search = "", status = "" } = req.query;

      const query = {};
      if (search) query.name = { $regex: search, $options: "i" };
      if (status) query.status = status;

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await Order.countDocuments(query);

      res.status(200).json({
        orders,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      res
        .status(500)
        .json({ error: "Erro ao buscar pedidos no banco de dados" });
    }
  } else if (req.method === "PUT") {
    try {
      await connectToDatabase();

      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: "ID e status são obrigatórios" });
      }

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      res.status(200).json({ message: "Status atualizado com sucesso", order });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      res.status(500).json({ error: "Erro ao atualizar status do pedido" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
