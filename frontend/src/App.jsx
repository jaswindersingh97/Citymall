import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MemeGallery from './pages/MemeGallery';

function App() {
  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MemeGallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
