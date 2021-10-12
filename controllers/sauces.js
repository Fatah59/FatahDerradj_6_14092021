// Importation du modèle
const Sauce = require('../models/sauce');

// Importation du package fs de Node qui permet de modifier le système de fichier
const fs = require('fs');

// Logique route POST pour poster une sauce
exports.createSauce = (req, res, next) => {
  // Analyse de l'objet qui se trouve dans la requête avec JSON.parse pour obtenir un objet utilisable
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    // Opérateur spread permet la copie de tous les éléments de la req.body
    ...sauceObject,
    // URL complète de l'image car la requête ne contient que filename
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  // Méthode qui enregistre la sauce en BDD et renvoie une promise
  sauce.save()
    // Réponse de réussite
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    // Réponse d'erreur
    .catch((error) => res.status(400).json({ error }));
};

// Logique route PUT pour mettre à jour une sauce
exports.modifySauce = (req, res, next) => {
  // Création de l'objet sauceObject qui regarde si req.file existe donc l'image à modifier
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      } // Traitement de la requête comme objet car l'image n'existe pas
    : { ...req.body };
  // Méthode updateOne() pour mettre à jour la sauce
  Sauce.updateOne(
    // Trouver la sauce par son id
    { _id: req.params.id },
    // Transmettre ce qui remplace la sauce
    { ...sauceObject, _id: req.params.id }
  )
    // Réponse de réussite
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    // Réponse d'erreur
    .catch((error) => res.status(400).json({ error }));
};

// Logique route DELETE pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // Utilisation de l'id reçu en paramètre pour accèder à la sauce correspondante en BDD
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // Séparation du nom de fichier car nous savons que l'URL contient un segment /images/
      const filename = sauce.imageUrl.split('/images')[1];
      // Appel de la fonction unlink pour supprimer le fichier avec l'argument correspondant au chemin du fichier et un callback 
      // indiquant ce qu'il faut faire une fois le fichier supprimé
      fs.unlink(`images/${filename}`, () => {
        // Méthode deleteOne pour supprimer l'objet correspondant en BDD
        Sauce.deleteOne({ _id: req.params.id })
          // Réponse de réussite
          .then(() => res.status(200).json({ message: 'Sauce suprimé !' }))
          // Réponse d'erreur
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Logique route GET pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
  // Utilisation de la méthode findOne pour trouver la sauce unique ayant le même _id que la requête
  Sauce.findOne({ _id: req.params.id })
    // Renvoie d'une Promise "sauce" au frontend
    // Réponse de réussite
    .then((sauce) => res.status(200).json(sauce))
    // Réponse d'erreur
    .catch((error) => res.status(404).json({ error }));
};

// Logique route GET pour afficher toutes les sauces
exports.getAllSauce = (req, res) => {
  // Méthode find renvoie un tableau de toutes les "sauces" de la BDD
  Sauce.find()
    // Réponse de réussite
    .then((sauces) => res.status(200).json(sauces))
    // Réponse d'erreur
    .catch((error) => res.status(400).json({ error }));
};

// Logique route POST  pour ajouter un Like ou un dislike
exports.likeDislike = async (req, res, next) => {
  // Pour ajouter un like
  if (req.body.like === 1) {
    Sauce.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: {
          usersLiked: req.body.userId,
        },
        $inc: {
          likes: +1,
        },
      }
    )
      .then(() => res.status(200).json({ message: "j'aime ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }
  // Pour retirer un like
  if (req.body.like === 0) {
    Sauce.findOne({
      _id: req.params.id,
      usersLiked: req.body.userId,
    }).then((sauceLiked) => {
      if (sauceLiked != null) {
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $pull: {
              usersLiked: req.body.userId,
            },
            $inc: {
              likes: -1,
            },
          }
        )
          .then(() =>
            res.status(200).json({ message: "j'aime a été retiré !" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else {
        // Si ce n'est pas un like (null) donc c'est un dislike
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            $pull: {
              usersDisliked: req.body.userId,
            },
            $inc: {
              dislikes: -1,
            },
          }
        )
          .then(() =>
            res.status(200).json({ message: "j'aime a été retiré !" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }

  // Pour ajouter un dislike
  if (req.body.like === -1) {
    Sauce.updateOne(
      {
        _id: req.params.id,
      },
      {
        $push: {
          usersDisliked: req.body.userId,
        },
        $inc: {
          dislikes: +1,
        },
      }
    )
      .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
      .catch((error) => res.status(400).json({ error }));
  }
};
