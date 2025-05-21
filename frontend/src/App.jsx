import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MemeGallery from './pages/MemeGallery';

function App() {
  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={username ? <MemeGallery /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={username ? <Navigate to="/" replace /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
