import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem('username', username.trim());
    navigate('/');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Enter username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
