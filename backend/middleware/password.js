const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 8 caractères, un chiffre et pas d'espaces",
      {
        "content-type": "application/json",
      }
    );
    res.end("Mot de passe incorrect.");
  } else {
    next();
  }
};
