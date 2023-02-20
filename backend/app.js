// Importation du module express
const express = require("express");

// Importation du module mongoose pour la connexion à la base de données MongoDB
const mongoose = require("mongoose");

const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

dotenv.config();
// Connexion à la base de données avec mongoose.
// Le lien de connexion inclut l'utilisateur et le mot de passe de la base de données, ainsi que le nom de la base de données
mongoose
  .connect(
    "mongodb+srv://Allamor:azerty1234@piiquante.qcywnhs.mongodb.net/test",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  // Si la connexion réussit, un message est affiché dans la console
  .then(() => console.log("Connexion à MongoDB OK !"))
  // Si la connexion échoue, un message d'erreur est affiché dans la console
  .catch(() => console.log("Connexion à MongoDB Fail !"));

// Création de l'application express
const app = express();

app.use((req, res, next) => {
  // Définit l'en-tête Access-Control-Allow-Origin sur "*" pour autoriser l'accès à toutes les origines
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Définit l'en-tête Access-Control-Allow-Headers pour autoriser les en-têtes de requête suivants:
  // Origin, X-Requested-With, Content, Accept, Content-Type, Authorization
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Définit l'en-tête Access-Control-Allow-Methods pour autoriser les méthodes de requête suivantes:
  // GET, POST, PUT, DELETE, PATCH, OPTIONS
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  // Passe à la prochaine étape du traitement de la requête
  next();
});

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

// Exportation de l'application express pour pouvoir l'utiliser dans d'autres fichiers
module.exports = app;
