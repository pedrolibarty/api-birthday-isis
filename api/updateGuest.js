import db from "./data-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { id_guest, ind_env } = req.body;

  if (!id_guest) {
    return res
      .status(400)
      .json({ error: "Parâmetro 'id_guest' é obrigatório." });
  }

  try {
    const result = await db
      .from("guests")
      .update({ ind_env })
      .eq("id_guest", id_guest);

    res.status(200).json({ message: "Atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro inesperado.", details: error.message });
  }
}
