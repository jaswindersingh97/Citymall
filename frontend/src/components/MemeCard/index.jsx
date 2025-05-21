import React, { useState ,useEffect} from 'react';

export default function MemeCard({ meme, onBid, onVote, onGenerateCaption }) {
  const [state, setState] = useState({
    bidAmount: '',
    loadingCaption: false,
    caption: meme.caption || '',
    vibe: meme.vibe || '',
    currentBid: meme.highest_bid || 0,
    currentBidder: meme.highest_bidder || '',
    votes: meme.upvotes || 0,
  });

  useEffect(() => {
  setState({
    bidAmount: '',
    loadingCaption: false,
    caption: meme.caption || '',
    vibe: meme.vibe || '',
    currentBid: meme.highest_bid || 0,
    currentBidder: meme.highest_bidder || '',
    votes: meme.upvotes || 0,
  });
}, [meme]);

  const setMemeCaption = (caption,vibe)=>{
    setState((prevdata)=>(
      {...prevdata, caption:caption, vibe:vibe}
    ))
  }
  const handleVote = async (type) => {
    if (onVote) {
      const newVotes = type === 'up' ? state.votes + 1 : state.votes - 1;
      setState(prev => ({ ...prev, votes: newVotes })); // optimistic update
      await onVote(meme.id, type);
    }
  };

  const handleBid = async () => {
    const bidNum = parseInt(state.bidAmount);
    if (!bidNum || bidNum <= state.currentBid) return alert(`Bid must be > ${state.currentBid}`);
    setState(prev => ({
      ...prev,
      currentBid: bidNum,
      currentBidder: 'You',
      bidAmount: '',
    })); 
    if (onBid) await onBid(meme.id, bidNum);
  };

  const handleGenerateCaption = async () => {
    setState(prev => ({ ...prev, loadingCaption: true }));
    if (onGenerateCaption) {
      const { caption, vibe } = await onGenerateCaption(meme.id,setMemeCaption);
      setState(prev => ({ ...prev, caption, vibe, loadingCaption: false }));
    } else {
      setState(prev => ({ ...prev, loadingCaption: false }));
    }
  };

  return (
    <div className="meme-card bg-black p-4 rounded border border-pink-500 neon-glow max-w-sm">
      <img src={meme.image_url} alt={meme.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-pink-400 mt-2 font-bold">{meme.title}</h3>
      <p className="text-purple-400 text-sm italic">Tags: {meme.tags}</p>

      <div className="mt-2 text-pink-300">
        <div>Bid: {state.currentBid} credits by {state.currentBidder || '—'}</div>
        <div>Votes: {state.votes}</div>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => handleVote('up')} className="btn-neon">👍 Upvote</button>
        <button onClick={() => handleVote('down')} className="btn-neon">👎 Downvote</button>
      </div>

      <div className="mt-3 flex gap-2 items-center">
        <input
          type="number"
          value={state.bidAmount}
          onChange={e => setState(prev => ({ ...prev, bidAmount: e.target.value }))}
          placeholder={`Bid > ${state.currentBid}`}
          className="input-neon w-20 bg-black text-pink-400 border-pink-500"
        />
        <button onClick={handleBid} className="btn-neon">Bid</button>
      </div>

      <button
        onClick={handleGenerateCaption}
        disabled={state.loadingCaption}
        className="btn-neon mt-3 w-full"
      >
        {state.loadingCaption ? 'Generating...' : 'Generate Caption & Vibe'}
      </button>

      {(state.caption || state.vibe) && (
        <div className="mt-3 p-2 bg-purple-900 rounded neon-glow text-pink-300 text-sm">
          <div><strong>Caption:</strong> {state.caption || '—'}</div>
          <div><strong>Vibe:</strong> {state.vibe || '—'}</div>
        </div>
      )}
    </div>
  );
}
