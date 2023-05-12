const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  watching: [{ type: Schema.Types.ObjectId, ref: 'Anime' }], // References to Anime documents
  planToWatch: [{ type: Schema.Types.ObjectId, ref: 'Anime' }], // References to Anime documents
  watched: [{ type: Schema.Types.ObjectId, ref: 'Anime' }], // References to Anime documents
});

module.exports = mongoose.model('User', UserSchema);

