import connectToDatabase from "../../utils/db";
import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  prato: Object,
  extras: Array,
  quantity: Number,
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();

    if (method === "GET") {
      const items = await Cart.find();
      return res.status(200).json({ items });
    } else if (method === "POST") {
      const { item, cartId } = req.body;

      if (cartId) {
        await Cart.findByIdAndUpdate(cartId, item);
        return res
          .status(200)
          .json({ message: "Item atualizado com sucesso!" });
      } else {
        const newItem = new Cart(item);
        await newItem.save();
        return res
          .status(201)
          .json({ message: "Item adicionado ao carrinho!" });
      }
    } else if (method === "DELETE") {
      const { id } = req.body;

      if (id) {
        await Cart.findByIdAndDelete(id);
        return res.status(200).json({ message: "Item removido com sucesso!" });
      } else {
        // Limpa todo o carrinho
        await Cart.deleteMany({});
        return res.status(200).json({ message: "Carrinho limpo com sucesso!" });
      }
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Método ${method} não permitido`);
    }
  } catch (error) {
    console.error("Erro na API do carrinho:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
