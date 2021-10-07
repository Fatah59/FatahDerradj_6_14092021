// Imporration de jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Extraction du token depuis le header
    const token = req.headers.authorization.split(' ')[1];
    // Décodage du token avec la fonction verify
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    // Extraction de l'id de l'user
    const userId = decodedToken.userId;
    // Si la demande contient un id, il est comparé avec celui extrait du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable ! ';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
};
