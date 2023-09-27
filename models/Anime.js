// models/Anime.js
const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
  user_id: String, // Clerk user id
  mal_id: Number,
  title: String,
  synopsis: String,
  images: Object,
  rank: Number,
  score: Number,
  status: String,
  rating: String,
  list: String, // 'currently watching', 'plan to watch', 'completed'
  episodes: Number,
  type: String,
});

module.exports = mongoose.model('Anime', animeSchema);
