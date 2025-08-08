// models/anime.js
const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema(
  {
    user_id: {
      type: String, // Clerk user id
      required: true,
      index: true,
      trim: true,
    },
    mal_id: {
      type: Number,
      required: true,
      index: true,
    },
    title: { type: String, default: '' },
    synopsis: { type: String, default: '' },
    images: { type: Object, default: {} },
    rank: { type: Number, default: null },
    score: { type: Number, default: null },
    status: { type: String, default: '' },
    rating: { type: String, default: '' },
    // 'currentlywatching' | 'plantowatch' | 'completed'  (normalized to avoid spaces)
    list: {
      type: String,
      enum: ['currentlywatching', 'plantowatch', 'completed'],
      default: 'plantowatch',
    },
    episodes: { type: Number, default: 0 },
    type: { type: String, default: '' },
  },
  { timestamps: true }
);

// One unique doc per (user_id, mal_id)
animeSchema.index({ user_id: 1, mal_id: 1 }, { unique: true });

module.exports =
  mongoose.models.Anime || mongoose.model('Anime', animeSchema);
