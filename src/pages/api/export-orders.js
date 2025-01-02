import connectToDatabase from "../../utils/db";
import Order from "../../models/Order";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { deliveryType, name, phone, address, cart, paymentMethod, change } =
      req.body;

    try {
      // Conecta ao banco de dados
      await connectToDatabase();

      // Salva o pedido no banco de dados
      const newOrder = await Order.create({
        deliveryType,
        name,
        phone,
        address,
        cart,
        paymentMethod,
        change,
      });

      // Cria a mensagem do pedido
      const orderMessage = `
Novo Pedido:
Nome: ${name}
Telefone: ${phone}
Tipo de Entrega: ${deliveryType === "entrega" ? "Entrega" : "Retirada"}
${deliveryType === "entrega" ? `Endereço: ${address}` : ""}
Pagamento: ${paymentMethod}${
        paymentMethod === "Dinheiro" && change
          ? ` (Troco para R$ ${parseFloat(change).toFixed(2)})`
          : ""
      }

Itens:
${cart
  .map(
    (item) =>
      `- ${item.name} (R$${item.price.toFixed(2)}) x${item.quantity} ${
        item.extras.length > 0
          ? `\n   Acréscimos: ${item.extras
              .map((extra) => `${extra.name} (R$${extra.price.toFixed(2)})`)
              .join(", ")}`
          : ""
      }`
  )
  .join("\n")}

Total: R$${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
`;

      // Gera o link do WhatsApp
      const whatsappNumber = "5516997636045"; // Substitua pelo número do restaurante
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        orderMessage
      )}`;

      // Retorna a mensagem de sucesso e o link do WhatsApp
      res
        .status(200)
        .json({ message: "Pedido salvo com sucesso!", whatsappLink });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro ao salvar o pedido no banco de dados" });
    }
  } else {
    // Define o método permitido
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
