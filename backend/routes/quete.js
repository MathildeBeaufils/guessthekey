var express = require('express');
var router = express.Router();
const User = require('../models/users');

router.post('/', (req, res) => {
    const nouvelleQuete = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        terminee: false,
        
    };
    // ajoute a tous les users
    User.find()
        .then(utilisateurs => {
        const promesses = utilisateurs.map(utilisateur => {
            utilisateur.tableauQuete.push(nouvelleQuete);
            return utilisateur.save();
        });
        // attend que les ajouts soient fait
        return Promise.all(promesses);
        })
        .then(() => {
        res.json({ message: 'Quête ajoutée à tous les utilisateurs avec succès !' });
        })
        // pourquoi j'ai une erreur alors que ca fonctionne ?
        .catch(error => {
        console.error('Erreur lors de l’ajout de la quête :', error);
        res.json({ message: 'Erreur interne', error });
        });
});

module.exports = router;