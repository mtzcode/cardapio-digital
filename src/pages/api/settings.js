import connectToDatabase from "../../utils/db";
import Settings from "../../models/Settings";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      const settings = await Settings.findOne();
      if (!settings) {
        return res
          .status(404)
          .json({ message: "Configurações não encontradas." });
      }
      res.status(200).json(settings);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      res.status(500).json({ error: "Erro ao buscar configurações." });
    }
  } else if (req.method === "POST") {
    try {
      const { companyName, description, logoUrl, themeColor } = req.body;

      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      settings.companyName = companyName || settings.companyName;
      settings.description = description || settings.description;
      settings.logoUrl = logoUrl || settings.logoUrl;
      settings.themeColor = themeColor || settings.themeColor;

      await settings.save();
      res
        .status(200)
        .json({ message: "Configurações atualizadas com sucesso.", settings });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      res.status(500).json({ error: "Erro ao salvar configurações." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
