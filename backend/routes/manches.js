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
  console.log("coucou la route")
  const categorieId = [];
  const categories = req.body.selectedItem[3].categorie;
  for (let i = 0; i < categories.length; i++) {
    categorieId.push(categories[i]);
  }
  const user = req.body.selectedItem[0].username;
  const theme = req.body.selectedItem[1].theme;
  const key = req.body.selectedItem[2].key;
  const titre1=req.body.selectedItem[4].titre[0];
  const titre2=req.body.selectedItem[4].titre[1];
  const titre3=req.body.selectedItem[4].titre[2];
  const titre4=req.body.selectedItem[4].titre[3];
  const titre5=req.body.selectedItem[4].titre[4];
  console.log(req.body.selectedItem[4].titre[0].trackId)
  User.findOne({ username: user}).then(user => {
    const userId = user._id;
    const newManche = new Manche({
    titre1: titre1.title,
    artiste1: titre1.artist,
    trackId1: titre1.trackId,
    titre2: titre2.title,
    artiste2: titre2.artist,
    trackId2: titre2.trackId,
    titre3: titre3.title,
    artiste3: titre3.artist,
    trackId3: titre3.trackId,
    titre4: titre4.title,
    artiste4: titre4.artist,
    trackId4: titre4.trackId,
    titre5: titre5.title,
    artiste5: titre5.artist,
    trackId5: titre5.trackId,
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

// deja fait ?
router.post('/searchsong', (req, res) => {
  const search = req.body.search;

  fetch(`https://api.deezer.com/search/track?q=${search}&limit=6`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const simplifiedData = data.data.map(track => ({
        trackId: track.id,
        title: track.title,
        artist: track.artist.name,
        trackId: track.id
      }));

      res.json({ result: true, data: simplifiedData });
    })
    .catch(error => {
      console.error("Error fetching artist:", error);
      res.status(500).json({ result: false, error: "Internal server error" });
    });
});


// route qui recupere l'URL du titre
router.post('/musicByArtist', (req, res) => {
  const artiste = req.body.artiste;
  const musique = req.body.musique;

  fetch(`https://api.deezer.com/search/track?q=${musique}&limit=6`)
    .then(response => response.json())
    .then(data => {
      const morceauCorrespondant = data.data.find(track => {
        const titre = track.title.trim().toLowerCase();
        const nomArtiste = track.artist.name.trim().toLowerCase();

        return titre === musique && nomArtiste === artiste
      });

      if (!morceauCorrespondant) {
        return res.json({ result: false, error: "Aucun morceau trouvé correspondant à l'artiste et au titre donnés." });
      }

      const urlMusic = morceauCorrespondant.link;
      const id = morceauCorrespondant.id;

      return res.json({ result: true, data: { id, urlMusic } });
    })
    .catch(error => {
      console.error("Error fetching artist:", error);
      res.status(500).json({ result: false, error: "Erreur serveur" });
    });
});


// get manche by Id
router.post('/roundID', async (req, res) => {
  console.log('reception  req.body.id', req.body.id)
  const id = req.body.id;
  try {
    const data = await Manche.findOne({ _id: id });
    if (!data) {
      return res.json({ result: false, message: "Pas de manches trouvées" });
    }
    const trackIds = [data.trackId1, data.trackId2, data.trackId3, data.trackId4, data.trackId5];
    console.log('trackIds', trackIds)
      console.log('test');
    // Récupération des previews
    const previews = await Promise.all(
      trackIds.map(trackId =>
        fetch(`https://api.deezer.com/track/${trackId}`)
          .then(response => response.json())
          .then(json => json.preview)
      )
    );

    const key = data.key;
    const theme = data.theme;
    const tracks = [
      { artist: data.artiste1, title: data.titre1, trackID: previews[0]},
      { artist: data.artiste2, title: data.titre2, trackID: previews[1] },
      { artist: data.artiste3, title: data.titre3, trackID: previews[2] },
      { artist: data.artiste4, title: data.titre4, trackID: previews[3] },
      { artist: data.artiste5, title: data.titre5, trackID: previews[4] },
    ];
    res.json({ result: true, key, theme, tracks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, message: error });
  }
});



module.exports = router;