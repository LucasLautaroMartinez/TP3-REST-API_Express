require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando correctamente",
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});