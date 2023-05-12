const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimeSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: String,
  aniApiId: { type: Number, required: true }, 
  usersWatching: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
});

module.exports = mongoose.model('Anime', AnimeSchema);

