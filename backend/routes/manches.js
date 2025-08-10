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
// key et theme pas en bdd
router.post('/', function(req, res) {
  const categorieId = [];
  const categories = req.body.selectedItem[3].categorie;
  for (let i = 0; i < categories.length; i++) {
    categorieId.push(categories[i]);
  }
  console.log(categorieId)
  const user = req.body.selectedItem[0].username;
  const key = req.body.selectedItem[0].key;
  const theme = req.body.selectedItem[0].theme;
  const titre1=req.body.selectedItem[4].titre[0];
  const titre2=req.body.selectedItem[4].titre[1];
  const titre3=req.body.selectedItem[4].titre[2];
  const titre4=req.body.selectedItem[4].titre[3];
  const titre5=req.body.selectedItem[4].titre[4];

  User.findOne({ username: user}).then(user => {
    const userId = user._id;
    const newManche = new Manche({
    titre1: titre1.title,
    artiste1: titre1.artist,
    titre2: titre2.title,
    artiste2: titre2.artist,
    titre3: titre3.title,
    artiste3: titre3.artist,
    titre4: titre4.title,
    artiste4: titre4.artist,
    titre5: titre5.title,
    artiste5: titre5.artist,
    key: key,
    theme: theme,
    categories: categorieId, // tableau d'ID de categorie
    created_at: new Date(),
    created_by: userId, // Object ID requis
    });
    newManche.save().then(data => {
      res.json({ result: true, manche: data })
    })
    .catch(error => {
      console.error('Erreur lors de la création de la manche :', error);
    })
  })
});

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


// route qui recupere l'URL du titre
router.post('/musicByArtist', (req,res)=>{
  const artiste = req.body.artiste;
  const musique = req.body.musique;
  console.log('artiste',artiste)
  console.log('musique',musique)
  fetch(`https://api.deezer.com/search/track?q=${musique}&limit=100`)
  .then(response => response.json())
  .then(data => {
    const urlMusic = data.data[0].link
    res.json({ result: true, data:urlMusic });
  })
  .catch(error => {
    console.error("Error fetching artist:", error);
    res.status(500).json({ result: false, error: "Internal server error" });
  });
})


module.exports = router;