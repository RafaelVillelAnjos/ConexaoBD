require("dotenv").config(); 

const db = require("./db");

const port = process.env.PORT;

const express = require('express');

const app = express();

app.use(express.json());

// Rota GET para todos os clienets
app.get('/client', async (req, res) => {
    // Chama a função que seleciona os clientes no banco de dados
    const clientes = await db.selectCustomers();
    // Envia a resposta em formato JSON contendo os clientes
    res.json(clientes);
});

// Rota GET para um cliente específico
app.get('/client/:id', async (req, res) => {
    const cliente = await db.selectCustomer(req.params.id);
    res.json(cliente);
});

// Rota POST
app.post("/client", async (req, res) => {
    await db.InsertCustomer(req.body)

    // Receber a resposta da operação. 201 = Código que a operação deu certo.
    res.sendStatus(201)
})

app.listen(port);

console.log("Backend Rodando!")