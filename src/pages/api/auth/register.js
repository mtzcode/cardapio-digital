import connectToDatabase from "../../../utils/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    try {
      await connectToDatabase();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "Usuário registrado com sucesso." });
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
