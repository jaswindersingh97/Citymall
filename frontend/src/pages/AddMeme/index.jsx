import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from './supabase';

export default function AddMeme() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [form, setForm] = useState({ title: '', image_url: '', tags: '' });

  async function handleSubmit(e) {
    e.preventDefault();

    const imageUrl = form.image_url || 'https://i.imgur.com/3b6wZkF.png'; // default image
    const tags = form.tags.trim();

    // await supabase.from('memes').insert([{
    //   title: form.title,
    //   image_url: imageUrl,
    //   tags,
    //   creator: username,
    //   upvotes: 0,
    // }]);

    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
        className="border p-2 mb-2 w-full"
      />
      <input
        placeholder="Image URL (optional)"
        value={form.image_url}
        onChange={e => setForm({ ...form, image_url: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <input
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Meme</button>
    </form>
  );
}
