// Importation de mongoose
const mongoose = require('mongoose');

// Création du schéma de données
const sauceSchema = mongoose.Schema({
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    like: {type: Number},
    dislike: {type: Number},
    //  A modifier par un tableau des identifiants utilisateurs
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]},
});

// Exportation du schéma en tant que modèle
module.exports = mongoose.model('sauce', sauceSchema);