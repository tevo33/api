import express from "express";
import router from "./routes/produtos.js";



const app = express();
const port = 3000;

// Permite receber JSON no corpo das requisições
app.use(express.json());

// Rotas
app.use("/", router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
