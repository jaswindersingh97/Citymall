import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemeCard from './../../components/MemeCard';
import AddMemeModal from './../../components/AddMemeModal';
import socket from './../../socket';

export default function MemeGallery() {
  const [memes, setMemes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [topMemes, setTopMemes] = useState([]);
  const username = localStorage.getItem("username");

  // Fetch all memes
  useEffect(() => { 
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/memes`)
      .then(res => {
        setMemes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    setLeaderboardLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/leaderboard?top=5`)
      .then(res => {
        setTopMemes(res.data);
        setLeaderboardLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLeaderboardLoading(false);
      });
  }, []);

  // Socket listeners
  useEffect(() => {
    socket.on('connect', () => console.log('Socket connected:', socket.id));
    socket.on('disconnect', () => console.log('Socket disconnected'));

    socket.on('vote_update', ({ memeId, upvotes }) => {
      setMemes(prev => prev.map(m => (m.id === memeId ? { ...m, upvotes } : m)));
      setTopMemes(prev => prev.map(m => (m.id === memeId ? { ...m, upvotes } : m)));
    });

    socket.on('bid_update', ({ memeId, highest_bid, highest_bidder }) => {
      setMemes(prev => prev.map(m =>
        m.id === memeId ? { ...m, highest_bid, highest_bidder } : m
      ));
      setTopMemes(prev => prev.map(m =>
        m.id === memeId ? { ...m, highest_bid, highest_bidder } : m
      ));
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

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/memes`, {...newMeme, username});

      setMemes(prev => prev.map(m => (m.id === tempId ? res.data : m)));
    } catch (e) {
      console.error(e);
      setMemes(prev => prev.filter(m => m.id !== newMeme.id));
    } finally {
      setLoading(false);
    }
  };

  const onVote = async(memeId, type) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/memes/${memeId}/vote`, { type });
    } catch (e) {
      console.log(e);
    }
  };

  const onBid = async(memeId, bidNum) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/memes/${memeId}/bid`, {
        credits: bidNum, 
        username: username
      });
    } catch(error) {
      console.error(error);
    }
  };

  const onGenerateCaption = async(memeId, setMemeCaption) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/memes/${memeId}/caption`);
      const { caption, vibe } = res.data;
      setMemeCaption(caption, vibe);
    } catch (error) {
      console.error('Failed to generate caption:', error);
      setMemeCaption('YOLO to the moon!'); // fallback caption
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
            Meme Marketplace
          </h1>
          <p className="text-gray-400">Browse, vote, and bid on the hottest memes</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition-colors shadow-lg hover:shadow-pink-500/30"
        >
          Add Meme
        </button>
      </div>

      {showModal && (
        <AddMemeModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Meme Gallery */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col space-y-4 w-full">
                <div className="h-40 bg-gray-800 rounded-lg"></div>
                <div className="h-40 bg-gray-800 rounded-lg"></div>
                <div className="h-40 bg-gray-800 rounded-lg"></div>
              </div>
            </div>
          ) : memes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-pink-500 text-5xl mb-4">¯\_(ツ)_/¯</div>
              <h3 className="text-xl text-pink-300">NO MEMES FOUND</h3>
              <p className="text-gray-400 mt-2">Be the first to add a meme!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  gap-6">
              {memes.map(meme => (
                <MemeCard 
                  key={meme.id} 
                  meme={meme} 
                  onVote={onVote} 
                  onBid={onBid} 
                  onGenerateCaption={onGenerateCaption}
                />
              ))}
            </div>
          )}
        </div>

        {/* Leaderboard Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-pink-400 mb-4 border-b border-pink-900 pb-2">
              Top Memes
            </h2>
            
            {leaderboardLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : topMemes.length === 0 ? (
              <p className="text-gray-400">No leaderboard data yet</p>
            ) : (
              <div className="space-y-4">
                {topMemes.map((meme, index) => (
                  <div key={meme.id} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold 
                      ${index === 0 ? 'bg-yellow-500 text-gray-900' : 
                        index === 1 ? 'bg-gray-400 text-gray-900' : 
                        index === 2 ? 'bg-amber-700' : 'bg-gray-700 text-pink-400'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{meme.title || 'Untitled Meme'}</p>
                      <div className="flex items-center text-xs text-pink-400">
                        <span className="mr-1">↑</span>
                        <span>{meme.upvotes || 0}</span>
                      </div>
                    </div>
                    {meme.image_url && (
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img 
                          src={meme.image_url} 
                          alt={meme.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}