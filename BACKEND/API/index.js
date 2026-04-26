require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware para CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});