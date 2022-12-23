const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Définir un schéma pour le modèle d'utilisateur
const userSchema = mongoose.Schema({
  // Le champ email est requis et doit être unique
  email: { type: String, required: true, unique: true },
  // Le champ password est requis
  password: { type: String, required: true },
});

// Utiliser le plugin de validation unique pour s'assurer que le champ email est unique
userSchema.plugin(uniqueValidator);

// Exporter le modèle d'utilisateur
module.exports = mongoose.model("User", userSchema);
