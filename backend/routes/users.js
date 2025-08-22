var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Mission = require('../models/Missions');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// route POST (/user/guessSignup) pour créer un nouvel utilisateur en tant qu'invité
router.post('/guessSignup', (req, res) => {
  if (!checkBody(req.body, ['username'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }
  // création nouvel utilisateur après avoir checké que le nom d'utilisateur n'existe pas déjà
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const registrationDate = new Date();
      
      const newUser = new User({
        username: req.body.username,
        created_at: registrationDate,
        email: req.body.email,
        password: '',
        token: uid2(32),
        isSignedUp: false,
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

// route POST (/user/signup) pour créer un nouvel utilisateur
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['email','username', 'password'])) {
    res.json({ result: false, error: 'Champs manquants ou vides' });
    return;
  }
  Mission.find()
  .then(data=>{
    const allMissions = data;
  User.findOne({ username: req.body.username }).then(data => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const registrationDate = new Date();

        const newUser = new User({
          username: req.body.username,
          created_at: registrationDate,
          email: req.body.email,
          password: hash,
          token: uid2(32),
          isSignedUp: true,
          isAdmin: false,
          nbVictoire: 0,
          keyPoint: 0,
          itemTete: '',
          itemTorse: '',
          itemJambes: '',
          itemPieds: '',
          tableauMissionsCampagne:allMissions,
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
router.delete('/deleteUser/:email', (req, res) => {
  const email = req.params.email;
  User.deleteOne({ email }).then(user => {
    res.json({ result: true, deletedUser: user, message: 'Utilisateur supprimé' });
  }).catch(err => {
    res.json({ result: false, error: err.message });
  });
});

// Route GET pour récupérer un utilisateur à partir de son token
router.get('/:token', (req, res) => {
  User.findOne({token: req.params.token}).then(data => {
    if(data){
      res.json({ result: true, data: data})
    } else {
      res.json({ result: false, message: "Utilisateur non trouvé"})
    }
  })
})

// update username
router.post('/updateUsername', (req, res) => {
  const { username, newUsername } = req.body;

  User.updateOne({ username }, { username: newUsername })
    .then((result) => {
      console.log("Résultat de updateOne :", result);
      res.json({ result: true, update: result });
    })
    .catch(error => {
      res.status(500).json({ result: false, error: error.message });
    });
});



// update password
router.post('/updatePassword', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ result: false, error: "Champs manquants" });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur introuvable" });
    }
    User.updateOne({ email }, { password: hash })
      .then(() => {
        res.json({ result: true, message: 'Mot de passe changé avec succès' });
      })
      .catch(error => {
        res.status(500).json({ result: false, error: error.message });
      });
  });
});

module.exports = router;
