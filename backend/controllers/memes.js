const asyncHandler = require("express-async-handler");

const {supabase} = require("./../config/db")

const axios = require("axios");

const cache = {};

const createMeme = async(req,res) =>{
  const { title, imageUrl, tags, username } = req.body;

  if (!title || !username) {
    return res.status(400).json({ message: 'Title and username are required.' });
  }

  const memeData = {
    title,
    image_url: imageUrl || 'https://i.imgur.com/7F2JX6U.png', 
    tags,
    username,
    upvotes: 0,
  };

  const { data, error } = await supabase
    .from('memes')
    .insert([memeData])
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create meme');
  }

  res.status(201).json(data);

}
const  getMemes= async(req,res) =>{
    const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Failed to fetch memes');
  }

  res.status(200).json(data);

}
const placeBid = async(req,res) =>{
    const memeId = req.params.id;
    const { credits, username } = req.body;

    if (!credits || !username) {
      return res.status(400).json({ message: 'Credits and username are required.' });
    }

    const { data, error } = await supabase
      .from('bids')
      .insert([{ meme_id: memeId, username, credits }])
      .select()
      .single();

    if (error) {
      throw new Error('Failed to place bid');
    }

    res.status(201).json(data);

}
const vote= async(req,res) =>{
  const memeId = req.params.id;
  const { type } = req.body;

  if (!['up', 'down'].includes(type)) {
    return res.status(400).json({ message: 'Invalid vote type' });
  }

  const increment = type === 'up' ? 1 : -1;

  const { data: meme, error: fetchError } = await supabase
    .from('memes')
    .select('upvotes')
    .eq('id', memeId)
    .single();

  if (fetchError || meme === null) {
    return res.status(404).json({ message: 'Meme not found' });
  }

  const updatedVotes = meme.upvotes + increment;

  const { data, error } = await supabase
    .from('memes')
    .update({ upvotes: updatedVotes })
    .eq('id', memeId)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update votes');
  }

  res.status(200).json(data);

}
const generateCaption = async(req,res) =>{
  const memeId = req.params.id;

  if (cache[memeId]) {
    return res.status(200).json(cache[memeId]);
  }



  const { data: meme, error: fetchError } = await supabase
    .from('memes')
    .select('title, tags')
    .eq('id', memeId)
    .single();

  if (fetchError || !meme) {
    return res.status(404).json({ message: 'Meme not found' });
  }

  const prompt = `Generate a funny caption and a vibe description for a meme with tags: ${meme.tags} and title: "${meme.title}". Respond as JSON with keys "caption" and "vibe".`;

  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.data.candidates[0].content.parts[0].text);
    } catch {
      jsonResponse = { caption: "YOLO to the moon!", vibe: "Retro Stonks Vibes" };
    }

    const { caption, vibe } = jsonResponse;

    const { error: updateError } = await supabase
      .from('memes')
      .update({ caption, vibe })
      .eq('id', memeId);

    if (updateError) throw new Error('Failed to save caption and vibe');
    
    cache[memeId] = { caption, vibe };
    res.status(200).json({ caption, vibe });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      caption: "YOLO to the moon!",
      vibe: "Retro Stonks Vibes",
      fallback: true
    });
  }

}
module.exports = {
    createMeme:asyncHandler(createMeme), 
    getMemes:asyncHandler(getMemes), 
    placeBid:asyncHandler(placeBid), 
    vote:asyncHandler(vote), 
    generateCaption:asyncHandler(generateCaption) 
} 
