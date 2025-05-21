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
    creator:username,
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
      .insert([{ meme_id: memeId, user:username, credits }])
      .select()
      .single();

    if (error) {
      console.log(error)
      throw new Error('Failed to place bid');
    }

    req.io.emit('bid_update', {
      memeId,
      highest_bid: credits,
      highest_bidder: username,
    });

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
  console.log("emitting")
  req.io.emit('vote_update', { memeId, upvotes: updatedVotes });
  console.log("emited")

  res.status(200).json(data);

}
const generateCaption = async (req, res) => {
  const memeId = req.params.id;
    const { data: meme, error: fetchError } = await supabase
      .from('memes')
      .select('title, tags')
      .eq('id', memeId)
      .single();

    if (fetchError || !meme) {
      throw new Error('Meme not found');
    }

    const prompt = `Generate a funny caption and a vibe description for a meme with tags: ${meme.tags} and title: "${meme.title}". Respond as JSON stringified with keys "caption" and "vibe".`;

    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    let jsonResponse;
    const rawText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log(rawText);
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    jsonResponse = JSON.parse(cleaned);
    const { caption, vibe } = jsonResponse;

    const { error: updateError } = await supabase
      .from('memes')
      .update({ caption, vibe })
      .eq('id', memeId);

    if (updateError) throw new Error('Failed to save caption and vibe');

    res.status(200).json({ caption, vibe });
  
};
module.exports = {
    createMeme:asyncHandler(createMeme), 
    getMemes:asyncHandler(getMemes), 
    placeBid:asyncHandler(placeBid), 
    vote:asyncHandler(vote), 
    generateCaption:asyncHandler(generateCaption) 
} 
