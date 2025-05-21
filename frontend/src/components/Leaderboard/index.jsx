// src/components/Leaderboard.js
import { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCount, setTopCount] = useState(10);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard?top=${topCount}`);
        const data = await response.json();
        setMemes(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [topCount]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-pink-500 pb-4">
          <h2 className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            MEME LEADERBOARD
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-pink-400 font-mono">TOP:</span>
            <select 
              value={topCount} 
              onChange={(e) => setTopCount(Number(e.target.value))}
              className="bg-gray-800 border border-pink-500 text-pink-400 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-600"
            >
              {[5, 10, 20, 50].map(num => (
                <option key={num} value={num} className="bg-gray-900">{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-pink-900 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        {!loading && (
          <div className="space-y-4">
            {memes.map((meme, index) => (
              <div 
                key={meme.id} 
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300 border border-gray-700 hover:border-pink-500"
              >
                <div className="flex items-start p-4">
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 mr-4 mt-1 w-10 h-10 rounded-full flex items-center justify-center 
                    ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-gray-900 font-bold' : 
                      index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 
                      index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-900' : 
                      'bg-gray-700 text-pink-400'}`}
                  >
                    <span className="font-mono">#{index + 1}</span>
                  </div>

                  {/* Meme Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-mono text-pink-400 mb-2">{meme.title}</h3>
                      <div className="flex items-center bg-gray-900 px-3 py-1 rounded-full border border-pink-500">
                        <span className="text-pink-400 mr-1">↑</span>
                        <span className="font-bold text-pink-300">{meme.upvotes}</span>
                      </div>
                    </div>
                    
                    <img 
                      src={meme.image_url} 
                      alt={meme.title} 
                      className="w-full max-h-40 object-contain rounded-lg border border-gray-700 mt-2"
                    />
                    
                    {/* Tags (if available) */}
                    {meme.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {meme.tags.split(',').map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-gray-700 text-cyan-400 text-xs font-mono rounded-full"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && memes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-pink-500 text-5xl mb-4">¯\_(ツ)_/¯</div>
            <h3 className="text-xl text-pink-300 font-mono">NO MEMES FOUND</h3>
            <p className="text-gray-400 mt-2">The void is empty... for now</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;