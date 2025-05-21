import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemeCard from './../../components/MemeCard';
import AddMemeModal from './../../components/AddMemeModal';
import socket from './../../socket';

export default function MemeGallery() {
  const [memes, setMemes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  useEffect(() => { 
    axios.get(`${import.meta.env.VITE_API_URL}/memes`)
      .then(res => setMemes(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
socket.on('connect', () => console.log('Socket connected:', socket.id));
socket.on('disconnect', () => console.log('Socket disconnected'));

    socket.on('vote_update', ({ memeId, upvotes }) => {
    setMemes(prev =>
      prev.map(m => (m.id === memeId ? { ...m, upvotes } : m))
    );
    });

    socket.on('bid_update', ({ memeId, highest_bid, highest_bidder }) => {
      console.log({ memeId, highest_bid, highest_bidder })
      setMemes(prev =>
        prev.map(m =>
          m.id === memeId ? { ...m, highest_bid: highest_bid, highest_bidder: highest_bidder } : m
        )
      );
    });
    return () => {
    socket.off('vote_update');
    socket.off('bid_update');
  };
}, []);



  const handleCreate = async (newMeme) => {
    setLoading(true);
    try {
      const tempId = Date.now();
      setMemes(prev => [{ id: tempId, upvotes: 0, caption: '', bids: [], ...newMeme }, ...prev]);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/memes`, {...newMeme,username});

      setMemes(prev => prev.map(m => (m.id === tempId ? res.data : m)));
    } catch (e) {
      console.error(e);
      setMemes(prev => prev.filter(m => m.id !== newMeme.id));
    } finally {
      setLoading(false);
    }
  };

  const onVote = async(memeId,type)=>{
    try{
      const response = await axios({
        method:"post", 
        url:`${import.meta.env.VITE_API_URL}/memes/${memeId}/vote`,
        data:{
          type          
        }
      })
    }
    catch(e){
      console.log(e)
    }
  }
  const onBid = async(memeId,bidNum) =>{
    try{
      const res = await axios({
        method:"post", 
        url:`${import.meta.env.VITE_API_URL}/memes/${memeId}/bid`,
        data:{
          credits:bidNum, username:username
        }
      })
    }catch(error){
      console.error(error);
    }
  }

  const onGenerateCaption = async(memeId, setMemeCaption)=> {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/memes/${memeId}/caption`);
    const { caption,vibe} = res.data;
    setMemeCaption(caption,vibe);
  } catch (error) {
    console.error('Failed to generate caption:', error);
    setMemeCaption('YOLO to the moon!'); // fallback caption
  }
}

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <button
        onClick={() => setShowModal(true)}
        className="btn-neon mb-6"
      >
        Add Meme
      </button>

      {showModal && (
        <AddMemeModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memes.map(meme => (
          <MemeCard key={meme.id} meme={meme} onVote={onVote} onBid={onBid} onGenerateCaption={onGenerateCaption}/>
        ))}
      </div>
    </div>
  );
}
