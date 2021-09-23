//  Importation de bcrypt
const bcrypt = require('bcrypt');

// Importation de jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    // Appel fonction de hachage de bcrypt qui génère un hash
    bcrypt.hash(req.body.password, 10)
    // Création d'un utilisateur
    .then(hash => {
        const user = new User({
            email: req.body.email, 
            password: hash
        });
        // Enregistrement de l'user en BDD
        user.save()
        // Réponse de réussite
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        // Réponse d'erreur
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction login pour vérifier si l'user a des identifiants valides
exports.login = (req, res, next) => {
    // Vérification de l'existance de l'email de l'user
    User.findOne({ email: req.body.email })
    .then(user => {
        // Erreur si l'user n'existe pas dans la BDD
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison du mot de passe entré par l'user avec le hash enregistré en BDD
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // Erreur si le mot de passe ne correspond pas
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Si les informations d'identification sont valides, envoie d'une réponse 200
            res.status(200).json({
                // Envoi de l'id utilisateur et d'un token
                userId: user._id,
                // Utilisation de la fonction sign de jsonwebtoken pour encoder un nouveau token
                token: jwt.sign(
                    { userId: user._id },
                    //  Chaîne secrète temporaire de dev
                    'RANDOM_TOKEN_SECRET',
                    // Validité du token
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};