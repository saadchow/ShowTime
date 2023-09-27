const express = require('express');
const router = express.Router();

// Import the Anime model
const Anime = require('../models/Anime');

// GET all anime for a user
router.get('/anime', (req, res) => {
  const userId = req.headers['x-clerk-user-id']; // get user id from Clerk

  Anime.find({ user_id: userId })
    .then((anime) => res.json(anime))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// GET anime from 'currentlywatching' list
router.get('/anime/currentlywatching', (req, res) => {
  const userId = req.headers['x-clerk-user-id']; // get user id from Clerk

  Anime.find({ user_id: userId, list: 'currentlywatching' })
    .then((anime) => res.json(anime))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// GET anime from 'completed' list
router.get('/anime/completed', (req, res) => {
  const userId = req.headers['x-clerk-user-id']; // get user id from Clerk

  Anime.find({ user_id: userId, list: 'completed' })
    .then((anime) => res.json(anime))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// GET anime from 'plantowatch' list
router.get('/anime/plantowatch', (req, res) => {
  const userId = req.headers['x-clerk-user-id']; // get user id from Clerk

  Anime.find({ user_id: userId, list: 'plantowatch' })
    .then((anime) => res.json(anime))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// POST a new anime
router.post('/anime', (req, res) => {
  console.log('AHHHHHHHHHHH ITS WORKING')
  const newAnime = new Anime({
    ...req.body,
    user_id: req.headers['x-clerk-user-id'], // get user id from Clerk
  });

  newAnime
    .save()
    .then(() => res.json('Anime added'))
    .catch((err) => res.status(400).json('Error: ' + err.message)); // Send back error message
});

// DELETE an anime
router.delete('/anime/:id', (req, res) => {
  const userId = req.headers['x-clerk-user-id']; // get user id from Clerk

  Anime.findOneAndDelete({ mal_id: req.params.id, user_id: userId })
    .then(() => res.json('Anime deleted'))
    .catch((err) => res.status(400).json('Error: ' + err.message)); // Send back error message
});

module.exports = router;
