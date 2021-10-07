// Création d'un routeur Express
const express = require('express');

const router = express.Router();

// Importation du contrôleur
const sauceCtrl = require('../controllers/sauces');

// Application du middleware aux routes sauces à protéger
const auth = require('../middleware/auth');

// Ajout de multer
const multer = require('../middleware/multer-config');

// Routes de l'API
router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.get('/', auth, sauceCtrl.getAllSauce);

router.post('/:id/like', auth, sauceCtrl.likeDislike);


module.exports = router;
