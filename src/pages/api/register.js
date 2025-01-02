import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Usuário já cadastrado" });
    }

    const newUser = new User({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro no servidor. Tente novamente." });
  }
}
