import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login | MemeVerse';
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    localStorage.setItem('username', trimmed);
    // navigate('/');
      window.location.href = '/';

  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-xl max-w-sm w-full border border-pink-500 neon-glow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-400">Welcome to MemeVerse</h1>
        <input
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full p-2 mb-4 bg-black border border-pink-500 text-white rounded outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
