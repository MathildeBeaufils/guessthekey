var express = require('express');
var router = express.Router();
const Categorie = require('../models/categories');
const Manche = require('../models/manches');
const User = require('../models/users');

// --------------------- CATEGORIES ------------------------------ 

// Route qui récupère toutes les catégories disponibles
router.get('/categories', function(req, res, next) {
  Categorie.find()
  .then(data => {
    if(data && data.length > 0){
        res.json({result: true, categories: data})
    } else {
        res.json({result: false, message: "Pas de catégorie trouvée"})
    }
    
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des catégories :', error);
  });
});

// Route pour créer une catégorie
router.post('/categories', function(req, res) {

  Categorie.findOne( {nom: req.body.nom}).then(categorie => {
    if(categorie){
      res.json({ result: false, message: `La catégorie ${req.body.nom} existe déjà`})
    } else {

      const newCategorie = new Categorie({
        nom: req.body.nom,
        image: "", // A voir plus tard si on met un req.body.image ou un lien
        created_at: new Date(),
      });
      newCategorie.save().then(data => {
        res.json({ result: true, categorie: data.nom })
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde de la catégorie:', error);
      })
    }
  })
});

// route pour supprimer une catégorie
router.delete('/categories', function(req, res) {

  Categorie.findOne({ nom: { $regex: new RegExp(req.body.nom, 'i')} })
  .then( categorie => {

    if(!categorie){
      res.json({ result: false, message: `Pas de catégorie ${req.body.nom} à supprimer`})
    } else {
      Categorie.deleteOne({ nom: { $regex: new RegExp(req.body.nom, 'i')}})
      .then(() => {
        res.json({ result: true, message: `Catégorie ${req.body.nom} supprimée`})
      })
    }
  })
});
  

// --------------------- MANCHES ------------------------------ 

// Route pour récupérer les manches existantes
router.get('/', function(req, res) {
  Manche.find()
  .then(data => {
    if(data && data.length > 0){
        res.json({result: true, manches: data})
    } else {
        res.json({result: false, message: "Pas de manches trouvées"})
    }
    
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des manches :', error);
  });
});

// Route pour ajouter une manche 
router.post('/', function(req, res) {

  User.findOne({ username: req.body.username}).then(user => {

    Manche.findOne( {created_by: req.body.created_by, key: req.body.key}).then(manche => {
      if(manche){
        res.json({ result: false, message: `Il existe déjà une manche ${req.body.key} crée par ${req.body.users.username}`})
      } else {
        const newManche = new Manche({
        titre1: req.body.titre1,
        artiste1: req.body.artiste1,
        titre2: req.body.titre2,
        artiste2: req.body.artiste2,
        titre3: req.body.titre3,
        artiste3: req.body.artiste3,
        titre4: req.body.titre4,
        artiste4: req.body.artiste4,
        titre5: req.body.titre5,
        artiste5: req.body.artiste5,
        key: req.body.key,
        categories: req.body.categories, // Object ID requis, mettre le categories _id
        created_at: new Date(),
        created_by: req.body.created_by, // Object ID requis, mettre le user_id
        });
        newManche.save().then(data => {
          res.json({ result: true, manche: data })
        })
        .catch(error => {
          console.error('Erreur lors de la création de la manche :', error);
        })
      }
    })
  })
});


// // route  qui valide un input dans le front
// router.post('/searchartist', (req, res) => {
//   const search = req.body.search 
//   // faire la requete api ici
//   fetch(`https://api.deezer.com/search/artist?q=${search}`)
//     .then(response => response.json())
//     .then(data => {
//       const names = data.data.map(artist => artist.name);
//       res.json({ result: true, names }); // renvoie uniquement les noms
//   })
//   .catch(error => console.error("Error fetching artist:", error));
// });


router.post('/searchsong', (req, res) => {
  const search = req.body.search;

  fetch(`https://api.deezer.com/search/track?q=${search}&limit=10`)
    .then(response => response.json())
    .then(data => {
      const simplifiedData = data.data.map(track => ({
        title: track.title,
        artist: track.artist.name,
        idArtiste: track.artist.id
      }));

      res.json({ result: true, data: simplifiedData });
    })
    .catch(error => {
      console.error("Error fetching artist:", error);
      res.status(500).json({ result: false, error: "Internal server error" });
    });
});


// route qui recupere trackid grace a l'artiste et title depuis l'API


module.exports = router;