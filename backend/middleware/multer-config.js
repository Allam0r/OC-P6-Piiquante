// On importe le module multer pour la gestion des fichiers téléchargés
const multer = require("multer");

// On définit un objet contenant les différents types MIME pour les images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// On crée un objet de configuration pour multer avec une fonction de destination
// qui indique où enregistrer les fichiers téléchargés et une fonction de nom de fichier
// qui définit comment les fichiers téléchargés seront nommés
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // On enregistre les fichiers dans le dossier "images"
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // On remplace les espaces dans le nom original du fichier par des underscores
    const name = file.originalname.split(" ").join("_");
    // On récupère l'extension du fichier en fonction de son type MIME
    const extension = MIME_TYPES[file.mimetype];
    // On crée le nom du fichier en concaténant le nom modifié, la date actuelle et l'extension
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
