var express = require('express');
var router = express.Router();
const User = require('../models/users');

// get All missions d'un User    // fonctionne
// condition a ajouter si token pas trouver, renvoi false avec msg
router.get('/:token', (req, res) => {
    const token = req.params.token;
    User.findOne({ token: token })
    .then(data => {
        console.log(data.tableauMissionsCampagne)
        res.json({ data: data.tableauMissionsCampagne });
    })
});


// update mission d'un User // fonctionne
router.put('/', (req, res) => {
    User.updateOne(
        {
            username: req.body.username,
            'tableauMissionsCampagne.nom': req.body.nom
        },
        { $set: {'tableauMissionsCampagne.$.terminee': true,}}
    )
    .then(res.json({result: true}))
});



// creer une mission        // fonctionne mais a tester sur tout les users
// ajouter creer manche pour faire une mission
router.post('/', (req, res) => {
    const nouvelleMission = {
        nom: req.body.nom,
        image: req.body.image,
        difficulte: req.body.difficulte,
        terminee: false,
        manches: '6890cc0dfa4467a0fadd285b' // ID test
    };
    // ajoute a tous les users
    User.find()
        .then(utilisateurs => {
        const promesses = utilisateurs.map(utilisateur => {
            utilisateur.tableauMissionsCampagne.push(nouvelleMission);
            return utilisateur.save();
        });
        // attend que les ajouts soient fait
        return Promise.all(promesses);
        })
        .then(() => {
        res.json({ message: 'Mission ajoutée à tous les utilisateurs avec succès !' });
        })
        // pourquoi j'ai une erreur alors que ca fonctionne ?
        .catch(error => {
        console.error('Erreur lors de l’ajout de la mission :', error);
        res.json({ message: 'Erreur interne', error });
        });
});

module.exports = router;