// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const {supabase} = require('./../config/db'); // adjust path as needed

router.get('/', async (req, res) => {
  const top = parseInt(req.query.top) || 10;

  const { data, error } = await supabase
    .from('memes')
    .select('*')
      .order('upvotes', { ascending: false })
            .limit(top);


  if (error) return res.status(500).json({ error: 'Failed to fetch leaderboard' });

    res.json(data);

});

module.exports = router;
