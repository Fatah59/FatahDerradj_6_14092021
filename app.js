require('dotenv').config();

const express = require('express');

// Importation mongoose
const mongoose = require('mongoose');

// Importation pour l'accès au path du server
const path = require('path');

// Importation du routeur pour les sauces
const sauceRoutes = require('./routes/sauces');

// Importation du routeur pour les user
const userRoutes = require('./routes/user');

const app = express();

// Connection à mongoose
mongoose
  .connect(process.env.SECRET_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware général
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Middleware utilisant une méthode de bodyParser pour transformer la requête en json

app.use(express.json());
// Indication à Express pour gérer la ressource image de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exporter l'application
module.exports = app;
