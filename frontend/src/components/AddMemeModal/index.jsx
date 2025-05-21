import React, { useState } from 'react';

export default function AddMemeModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    image_url: '',
    tags: '',
    loading: false,
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm(prev => ({ ...prev, loading: true }));

    // Prepare meme data with fallback for image
    const memeData = {
      title: form.title.trim() || 'Untitled Meme',
      image_url: form.image_url.trim() || 'https://i.imgflip.com/30b1gx.jpg', // default stonks meme
      tags: form.tags.trim(),
    };

    await onCreate(memeData);
    setForm({ title: '', image_url: '', tags: '', loading: false });
    onClose();
  };

  return (
    <div className="modal-bg fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow-lg w-96 neon-glow">
        <h2 className="text-pink-400 text-xl mb-4">Add New Meme</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="input-neon w-full mb-3"
        />
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="input-neon w-full mb-3"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="input-neon w-full mb-3"
        />

        <button type="submit" disabled={form.loading} className="btn-neon w-full">
          {form.loading ? 'Creating...' : 'Create Meme'}
        </button>

        <button type="button" onClick={onClose} className="mt-2 w-full text-center text-pink-500 hover:underline">
          Cancel
        </button>
      </form>
    </div>
  );
}
