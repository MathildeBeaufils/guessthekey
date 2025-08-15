var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/users');
const Mission = require('../models/Missions');


// get All missions d'un User    // fonctionne
router.get('/:token', (req, res) => {
    const token = req.params.token;
    if(!token){
        res.json({ result:false, msg: 'impossible de trouver vos missions' })
    }
    User.findOne({ token: token })
    .then(data => {
        res.json({ result: true , data: data.tableauMissionsCampagne });
    })
});


// update mission d'un User // fonctionne
router.put('/', (req, res) => {
    console.log('je suis la')
    console.log(req.body)
    User.updateOne(
        {
            username: req.body.username,
            'tableauMissionsCampagne._id': req.body.missionId
        },
        { $set: { 'tableauMissionsCampagne.$.terminee': true } }
    )
    .then(() => {
        res.json({ result: true });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ result: false, error: error.message });
    });
});




// creer une mission faire la view pour recuperer la manche
router.post('/', (req, res) => {
    console.log(req.body);

    const newMission = new Mission({
        nom: req.body.nom,
        image: req.body.image,
        difficulte: req.body.difficulte,
        terminee: false,
        manches: '689996dae3f8e08e1c2bc282',
    });

    newMission.save()
        .then(savedMission => {
            return User.find()
                .then(utilisateurs => {
                    const promesses = utilisateurs.map(utilisateur => {
                        utilisateur.tableauMissionsCampagne.push(savedMission._id); 
                        return utilisateur.save();
                    });
                    return Promise.all(promesses);
                });
        })
        .then(() => {
            res.json({ result: true, message: 'Mission ajoutée à tous les utilisateurs avec succès !' });
        })
        .catch(error => {
            console.error(`Erreur lors de l'ajout de la mission :`, error);
            res.json({ result: false, message: 'Erreur interne', error });
        });
});



module.exports = router;