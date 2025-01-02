import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cart: [
    {
      name: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Define explicitamente o nome da coleção como 'pedidos'
export default mongoose.models.Pedido ||
  mongoose.model("Pedido", OrderSchema, "pedidos");
