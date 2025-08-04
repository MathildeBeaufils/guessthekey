var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');



// route POST (/user/signup) pour créer un nouvel utilisateur
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['email','username', 'password'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }
  // création nouvel utilisateur après avoir checké que le nom d'utilisateur n'existe pas déjà
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const registrationDate = new Date();
      
      //date formaté sous la forme lundi 4 août 2025 à 17:06:19 UTC+2
      // const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      //   timeZone: 'Europe/Paris',
      //   dateStyle: 'full',
      //   timeStyle: 'long',
      // }).format(registrationDate);

      const newUser = new User({
        username: req.body.username,
        created_at: registrationDate,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        isAdmin: false,
        nbVictoire: 0,
        keyPoint: 0,
        itemTete: '',
        itemTorse: '',
        itemJambes: '',
        itemPieds: '',
      });

      newUser.save().then(data => {
        res.json({ result: true, token: data.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "Le nom d'utilisateur existe déjà" });
    }
  });
})

// route POST (/user/signin) pour se connecter
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }

  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: 'Utilisateur introuvable ou mot de passe incorrect' });
    }
  });
});

// route DELETE (/user/delete) pour supprimer un utilisateur
router.delete('/deleteUser', (req, res) => {
  User.deleteOne({ email: req.body.email }).then(user => {
    res.json({ result: true, deletedUser: user, message: 'Utilisateur supprimé' });
  })
})


module.exports = router;
