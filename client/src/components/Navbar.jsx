import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { auth, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl font-semibold tracking-wide">
          <Link to="/" className="hover:text-gray-200 transition-colors duration-200">
            AI Job Match
          </Link>
        </div>

        <div className="space-x-6 text-md">
          <Link to="/" className="hover:underline hover:text-gray-200 transition duration-200">
            Home
          </Link>

          {auth && (
            <Link to="/jobs" className="hover:underline hover:text-gray-200 transition duration-200">
              Jobs
            </Link>
          )}

          {!auth ? (
            <>
              <Link to="/login" className="hover:underline hover:text-gray-200 transition duration-200">
                Login
              </Link>
              <Link to="/register" className="hover:underline hover:text-gray-200 transition duration-200">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
