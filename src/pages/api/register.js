import connectToDatabase from "../../utils/db";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    try {
      await connectToDatabase();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Usuário já existe!" });
      }

      const newUser = new User({
        email,
        password, // Lembre-se de hash a senha em produção
        name,
      });

      await newUser.save();
      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).json({ error: "Erro no servidor!" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
