import connectToDatabase from "../../utils/db";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: "Usuário já registrado" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar o usuário:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
}
