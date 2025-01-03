import connectToDatabase from "utils/db";
import Product from "models/Product";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        const products = await Product.find({});
        return res.status(200).json(products);

      case "POST":
        const newProductData = {
          name: req.body.name,
          category: req.body.category,
          description: req.body.description,
          price: parseFloat(req.body.price),
          quantity: parseInt(req.body.quantity, 10),
          measure: req.body.measure,
          extras: req.body.extras || [],
          image: req.body.image,
        };
        const newProduct = await Product.create(newProductData);
        return res.status(201).json(newProduct);

      case "PUT":
        const { id, ...updates } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
          new: true,
        });
        return res.status(200).json(updatedProduct);

      case "DELETE":
        const { id: deleteId } = req.query;
        await Product.findByIdAndDelete(deleteId);
        return res
          .status(200)
          .json({ message: "Produto deletado com sucesso" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Método ${method} não permitido`);
    }
  } catch (error) {
    console.error("Erro na API de produtos:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
