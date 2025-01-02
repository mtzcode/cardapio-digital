import connectToDatabase from "../../utils/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${method} não permitido`);
  }

  const { cep } = req.body;

  if (!cep) {
    return res.status(400).json({ error: "CEP é obrigatório" });
  }

  try {
    const db = await connectToDatabase();
    const cepsCollection = db.collection("ceps");

    // Verificar no banco de dados local
    const existingCep = await cepsCollection.findOne({ cep });
    if (existingCep) {
      return res.status(200).json(existingCep);
    }

    // Consultar API externa
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      return res.status(404).json({ error: "CEP não encontrado" });
    }

    // Salvar no banco de dados
    const newCep = {
      cep,
      endereco: data.logradouro,
      bairro: data.bairro,
    };

    await cepsCollection.insertOne(newCep);

    return res.status(200).json(newCep);
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return res.status(500).json({ error: "Erro no servidor" });
  }
}
