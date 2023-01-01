// Importe la bibliothèque jsonwebtoken pour valider le token
const jwt = require("jsonwebtoken");

// Exporte la fonction de vérification de token
module.exports = (req, res, next) => {
  try {
    // Récupère le token dans l'en-tête d'autorisation de la requête et le décode
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    // Récupère l'identifiant de l'utilisateur à partir du token décodé
    const userId = decodedToken.userId;
    // Si l'identifiant de l'utilisateur est présent dans le corps de la requête et qu'il ne correspond pas à l'identifiant de l'utilisateur du token, lance une erreur
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      // Si la vérification du token réussit, appelle la fonction next() pour passer à la prochaine étape
      next();
    }
  } catch {
    // Si une erreur est levée lors de la vérification du token, renvoie une réponse avec un statut 401 et un message d'erreur
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
