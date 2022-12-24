const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Fonction d'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Chiffrement du mot de passe de l'utilisateur avec une force de 10
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'un nouvel utilisateur à partir des données envoyées dans la demande
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Fonction de connexion d'un utilisateur
exports.login = (req, res, next) => {
  // Recherche d'un utilisateur dans la base de données en utilisant l'adresse email envoyée dans la demande
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si aucun utilisateur n'est trouvé, envoyer une réponse d'erreur au client
      if (user === null) {
        res
          .status(401)
          .json({ message: "Identifiant/Mot de passe incorrect !" });
      } else {
        // Si l'utilisateur est trouvé, comparer le mot de passe envoyé dans la demande avec le mot de passe chiffré stocké dans la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            // Si les mots de passe ne correspondent pas, envoyer une réponse d'erreur au client
            if (!valid) {
              res
                .status(401)
                .json({ message: "Identifiant/Mot de passe incorrect !" });
            } else {
              // Si les mots de passe correspondent, envoyer une réponse de succès au client avec l'ID de l'utilisateur et un jeton de connexion
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => {
            // En cas d'erreur, envoyer une réponse d'erreur au client
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      // En cas d'erreur, envoyer une réponse d'erreur au client
      res.status(500).json({ error });
    });
};
