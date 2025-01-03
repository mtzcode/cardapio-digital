import connectToDatabase from "utils/db";
import Category from "models/Category";

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  try {
    switch (method) {
      case "GET":
        // Retorna todas as categorias
        const categories = await Category.find({});
        return res.status(200).json(categories.map((cat) => cat.name));

      case "POST":
        // Cria uma nova categoria
        const newCategory = await Category.create(req.body);
        return res.status(201).json(newCategory);

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Método ${method} não permitido`);
    }
  } catch (error) {
    console.error("Erro na API de categorias:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
