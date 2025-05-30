import db from "./data-source.js";

export default async function handler(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: "Esperado um array com { id, status }." });
  }

  try {
    const results = await Promise.all(
      updates.map(({ id_comp, status }) =>
        db.from("companions").update({ status }).eq("id_comp", id_comp)
      )
    );

    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      return res.status(500).json({
        message: "Algumas atualizações falharam.",
        details: errors.map(e => e.error.message),
      });
    }

    res.status(200).json({ message: "Todos os usuários foram atualizados com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro inesperado.", details: error.message });
  }
  }