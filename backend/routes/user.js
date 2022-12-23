// Importation de la bibliothèque express pour la création de routes
const express = require("express");
// Création d'un objet de type routeur express
const router = express.Router();
// Importation du contrôleur de l'utilisateur
const userCtrl = require("../controllers/user");

// Définition de la route POST /signup pour la création d'un compte utilisateur
router.post("/signup", userCtrl.signup);
// Définition de la route POST /login pour la connexion d'un utilisateur
router.post("/login", userCtrl.login);

// Export du routeur pour qu'il puisse être utilisé par d'autres fichiers
module.exports = router;
