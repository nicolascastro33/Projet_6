const express = require('express');
const mongoose = require('mongoose');
// const user = require('./models/user');

mongoose.connect('mongodb+srv://Nicolas:Souris19@cluster0.ttdfgbh.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
   next(); 
});

app.use((req, res, next) => {
    res.status(201);
    next(); 
}); 

app.use((req, res, next) => {
    console.log("connection réussi!")
}); 

module.exports = app;