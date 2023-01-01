// Inclut le modèle Sauce et le module fs
const Sauce = require("../models/Sauce");
const fs = require("fs");

// Exporte la fonction createSauce
exports.createSauce = (req, res, next) => {
  // Parse l'objet sauce à partir du corps de la requête et supprime la propriété _id
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Crée un nouvel objet Sauce avec l'objet parsé, les likes et dislikes par défaut, et une image
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    // Crée une URL d'image en utilisant le protocole de la requête, l'hôte de la requête, et le nom du fichier téléchargé
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Enregistre la sauce dans la base de données
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Exporte la fonction getOneSauce
exports.getOneSauce = (req, res, next) => {
  // Trouve une sauce dans la base de données en utilisant l'identifiant de la sauce passé dans les paramètres de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    // Si la sauce est trouvée, la renvoie dans la réponse avec un statut 200
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    // Si une erreur est rencontrée ou si la sauce n'est pas trouvée, renvoie une erreur dans la réponse avec un statut 404
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Exporte la fonction modifySauce
exports.modifySauce = (req, res, next) => {
  // Trouve une sauce dans la base de données en utilisant l'identifiant de la sauce passé dans les paramètres de la requête
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // Récupère le nom du fichier de l'image de la sauce à partir de l'imageUrl
    const filename = sauce.imageUrl.split("/images/")[1];
    // Supprime le fichier du serveur
    fs.unlink(`images/${filename}`, () => {
      // Si un nouveau fichier a été téléchargé dans la requête, crée un nouvel objet sauce avec les données mises à jour et la nouvelle imageUrl
      // Si aucun nouveau fichier n'a été téléchargé, crée un nouvel objet sauce avec les données mises à jour
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      // Met à jour la sauce dans la base de données avec le nouvel objet sauce
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// Exporte la fonction deleteSauce
exports.deleteSauce = (req, res, next) => {
  // Trouve une sauce dans la base de données en utilisant l'identifiant de la sauce passé dans les paramètres de la requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Récupère le nom du fichier de l'image de la sauce à partir de l'imageUrl
      const filename = sauce.imageUrl.split("/images/")[1];
      // Supprime le fichier du serveur
      fs.unlink(`images/${filename}`, () => {
        // Supprime la sauce de la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    // Si une erreur est rencontrée pendant la recherche de la sauce, renvoie une erreur dans la réponse avec un statut 500
    .catch((error) => res.status(500).json({ error }));
};

// Exporte la fonction getAllSauces
exports.getAllSauces = (req, res, next) => {
  // Trouve toutes les sauces dans la base de données
  Sauce.find()
    // Si les sauces sont trouvées, les renvoie dans la réponse avec un statut HTTP 200
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    // Si une erreur est rencontrée pendant la recherche des sauces, renvoie une erreur dans la réponse avec un statut 400
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Exporte la fonction likeSauce
exports.likeSauce = (req, res, next) => {
  // Récupère l'identifiant de la sauce et l'identifiant de l'utilisateur à partir des paramètres de la requête et la valeur de "like" à partir du corps de la requête
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  // Si la valeur de "like" est 1, met à jour la sauce pour augmenter le nombre de "likes" et ajouter l'identifiant de l'utilisateur à la liste des utilisateurs qui ont aimé la sauce
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce liké" }))
      .catch((error) => res.status(500).json({ error }));
  }
  // Si la valeur de "like" est -1, met à jour la sauce pour augmenter le nombre de "dislikes" et ajouter l'identifiant de l'utilisateur à la liste des utilisateurs qui n'ont pas aimés la sauce
  else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce disliké" }))
      .catch((error) => res.status(500).json({ error }));
  } else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce disliké" });
            })
            .catch((error) => res.status(500).json({ error }));
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce liké" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
