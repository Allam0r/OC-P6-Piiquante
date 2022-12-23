const http = require("http"); // Importe le module 'http'
const app = require("./app"); // Importe le module 'app' à partir du fichier './app'

// Fonction qui normalise le numéro de port passé en argument
// Si c'est un nombre, elle vérifie qu'il est positif et le retourne
// Si c'est une chaîne de caractères, elle la retourne telle quelle
// Si c'est autre chose, elle retourne false
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Définit le port à utiliser pour le serveur
// Si l'environnement contient une variable 'PORT', on l'utilise
// Sinon, on utilise le port 3000 par défaut
const port = normalizePort(process.env.PORT || "3000");

// Définit le port dans l'objet 'app'
app.set("port", port);

// Fonction qui gère les erreurs survenues lors de l'écoute sur un port donné
const errorHandler = (error) => {
  // Si l'erreur ne concerne pas l'écoute, on la lance
  if (error.syscall !== "listen") {
    throw error;
  }

  // Détermine l'adresse et le port utilisés par le serveur
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;

  // Selon le code d'erreur, on affiche un message d'erreur et on quitte le processus avec un code d'erreur
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Crée le serveur en utilisant 'app' comme écouteur de requête
const server = http.createServer(app);

// Ajoute la fonction 'errorHandler' comme gestionnaire d'événement pour l'événement 'error'
server.on("error", errorHandler);

// Ajoute une fonction anonyme comme gestionnaire d'événement pour l'événement 'listening'
server.on("listening", () => {
  // Détermine l'adresse et le port utilisés par le serveur
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Démarre le serveur en écoutant sur le port défini
server.listen(port);
