const Sauce = require('../models/sauce');
const fs = require('fs');

// Logique route POST sous forme de fonction
exports.createSauce = (req, res, next) => {
    console.log(req.body);
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

// Logique route PUT sous forme de fonction
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : {...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error}));
};

// Logique route DELETE sous forme de fonction
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink(`ìmages/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce suprimé !' }))
            .catch(error => res.status(400).json({ error}));     
        });
    })
    .catch(error => res.status(500).json (({ error })));

};

// Logique route GET sous forme de fonction
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error}));
};

// Logique route GET sous forme de fonction
exports.getAllSauce = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces)) 
    .catch(error => res.status(400).json({ error }));
};

