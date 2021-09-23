const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// Constante contenant la logique indiquant où enregistrer les fichiers
const storage = multer.diskStorage({
    // La fonction destination indique à multer d'enregistrer les fichiers dans images
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    // La fonction filename indique d'utiliser le nom d'origine en remplaçant les espaces pas des ubnderscores + un timestamp
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Exportation de multer avec la constante storage + indication que seul les fichiers images seront gérés
module.exports = multer({ storage }).single('image');