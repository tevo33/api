import { Pool } from "pg";

const pool = new Pool({
  user: "seu_usuario",
  host: "localhost",
  database: "meu_banco",
  password: "sua_senha",
  port: 5432,
});

export default pool;