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
        res.json({ result: true, data: data });
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

// Route GET pour récupérer un utilisateur à partir de son username
router.get('/:username', (req, res) => {

  User.findOne({username: req.params.username}).then(data => {
    if(data){
      res.json({ result: true, username: data})
    } else {
      res.json({ result: false, message: "Utilisateur non trouvé"})
    }
  })
})

// update username
router.post('/updateUsername', (req, res) => {
  const newUsername = req.body.newUsername;
  User.updateOne({ username: req.body.username }, { username: newUsername })
    .then(() => {
      res.json({ result: true, username: newUsername });
    })
    .catch(error => {
      res.json({ result: false, error: error.message });
    });
});



// update password
router.post('/updatePassword', (req, res) => {
  const { email, password, newPassword } = req.body;

  const hash = bcrypt.hashSync(newPassword, 10);

  User.findOne({ email }).then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      User.updateOne({ email }, { password: hash })
        .then(() => {
          res.json({ result: true, message: 'Mot de passe changé avec succès' });
        })
        .catch(error => {
          res.json({ result: false, error: error.message });
        });
    } else {
      res.json({ result: false, error: 'Utilisateur introuvable ou mot de passe incorrect' });
    }
  });
});



module.exports = router;
