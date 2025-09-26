import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';

function App() {
  const { auth, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={auth ? <Jobs /> : <Navigate to="/login" />} />
        <Route path="/login" element={!auth ? <Login /> : <Navigate to="/jobs" />} />
        <Route path="/register" element={!auth ? <Register /> : <Navigate to="/jobs" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
