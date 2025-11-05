import { Router, Request, Response } from "express";
import pool from "./pool.js";

const router = Router();

router.post("/post", async (req: Request, res: Response) => {
  const { quem, comentario, humano } = req.body;

  if (!quem || !comentario || humano === undefined) {
    return res.status(400).json({ error: "Campos obrigatórios: quem, comentario, humano" });
  }

  try {
    const sql = `
      INSERT INTO posts (quem, comentario, humano)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const values = [quem, comentario, humano];
    const result = await pool.query(sql, values);

    res.status(201).json({
      message: "Post criado com sucesso!",
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("Erro ao inserir post:", err);
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

/**
 * Retorna o total de posts
 */
router.get("/post/count", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM posts;");
    const count = parseInt(result.rows[0].count, 10);

    res.status(200).json({ total: count });
  } catch (err) {
    console.error("Erro ao contar posts:", err);
    res.status(500).json({ error: "Erro ao contar posts" });
  }
});

/**
 * Retorna todos os posts
 */
router.get("/post", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, quem, data_hora, comentario, humano
      FROM posts
      ORDER BY id;
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao listar posts:", err);
    res.status(500).json({ error: "Erro ao listar posts" });
  }
});

/**
 * Retorna um post pelo ID
 */
router.get("/post/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, quem, data_hora, comentario, humano
      FROM posts
      WHERE id = $1;
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao buscar post:", err);
    res.status(500).json({ error: "Erro ao buscar post" });
  }
});

/**
 * Busca posts por expressão no comentário (Full Text Search)
 */
router.get("/post/exp/:texto", async (req: Request, res: Response) => {
  const { texto } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, quem, data_hora, comentario, humano
      FROM posts
      WHERE to_tsvector('portuguese', comentario) @@ plainto_tsquery('portuguese', $1)
      ORDER BY data_hora DESC;
    `,
      [texto]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar posts por expressão:", err);
    res.status(500).json({ error: "Erro ao buscar posts por expressão" });
  }
});

export default router;
