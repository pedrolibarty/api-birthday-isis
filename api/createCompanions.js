import db from "./data-source.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { agrupamento, companions } = req.body;

  let guest = agrupamento.id_guest;

  if (guest === "") {
    const { data, error } = await db
      .from("guests")
      .insert([{ name: agrupamento.name }])
      .select();

    if (error) {
      return res
        .status(500)
        .json({ error: "Erro ao criar agrupamento: " + error.message });
    }

    guest = data[0].id_guest;
  }

  const companionsData = companions.map((name) => ({
    name,
    id_guest: guest,
  }));

  const { error: companionsError } = await db
    .from("companions")
    .insert(companionsData);

  if (companionsError) {
    return res
      .status(500)
      .json({ error: "Erro ao criar companions: " + companionsError.message });
  }

  return res
    .status(200)
    .json({ message: "Criado com sucesso", id_guest: guest });
}
