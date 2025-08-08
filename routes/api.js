// routes/api.js
const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');

// Helper: get user id from Clerk header
function getUserId(req) {
  return req.headers['x-clerk-user-id'];
}

// GET /api/anime?list=completed|currentlywatching|plantowatch
router.get('/anime', async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json('Error: missing user');

    const { list } = req.query;
    const filter = { user_id };
    if (list) filter.list = list;

    const data = await Anime.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(data);
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// GET /api/anime/:id  (id = mal_id)
router.get('/anime/:id', async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json('Error: missing user');

    const mal_id = Number(req.params.id);
    const doc = await Anime.findOne({ user_id, mal_id }).lean();
    if (!doc) return res.status(404).json('Error: not found');
    res.json(doc);
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// POST /api/anime  (UPSERT)
// Create or update by (user_id, mal_id). We strip _id to avoid duplicate key errors.
router.post('/anime', async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json('Error: missing user');

    // normalize list values from UI if they include spaces
    const normalizeList = (v) =>
      v?.toLowerCase().replace(/\s+/g, '') || 'plantowatch';

    const { _id, mal_id, list, ...rest } = req.body || {};
    if (!mal_id) return res.status(400).json('Error: mal_id required');

    const update = {
      user_id,
      mal_id,
      ...rest,
    };
    if (list) update.list = normalizeList(list);

    const doc = await Anime.findOneAndUpdate(
      { user_id, mal_id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(doc);
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// PUT /api/anime/:id  (id = mal_id) – update fields (e.g., move list)
router.put('/anime/:id', async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json('Error: missing user');

    const mal_id = Number(req.params.id);
    if (!mal_id) return res.status(400).json('Error: invalid mal_id');

    const body = req.body || {};
    if (body.list) {
      body.list = body.list.toLowerCase().replace(/\s+/g, '');
    }

    const doc = await Anime.findOneAndUpdate(
      { user_id, mal_id },
      { $set: body },
      { new: true }
    );

    if (!doc) return res.status(404).json('Error: not found');
    res.json(doc);
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// DELETE /api/anime/:id  (optional)
router.delete('/anime/:id', async (req, res) => {
  try {
    const user_id = getUserId(req);
    if (!user_id) return res.status(401).json('Error: missing user');

    const mal_id = Number(req.params.id);
    const result = await Anime.deleteOne({ user_id, mal_id });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

module.exports = router;
