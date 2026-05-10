require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware para CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE, OPTIONS'); // Adicionei OPTIONS aqui
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, id-token"
    );

    // Se for uma requisição do tipo OPTIONS, responde 200 e para por aqui
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

const routes = require('./routes/routes');
app.use('/api', routes);

const mongoURL = process.env.MONGO_URI; 
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);

mongoose.connect(mongoURL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

// LINHA 33: Sem aspas no PORT!
app.listen(PORT, '0.0.0.0', () => {
    // LINHA 34: Use CRASES (acento grave `), não aspas comuns (')
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});