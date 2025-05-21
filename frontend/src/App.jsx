import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AddMeme from './pages/AddMeme';
import MemeGallery from './pages/MemeGallery';

function App() {
  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/add"
          element={username ? <AddMeme /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<MemeGallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
