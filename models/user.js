// Importation de mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma de données de user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

// Exportation du schéma en tant que modèle
module.exports = mongoose.model('User', userSchema);
