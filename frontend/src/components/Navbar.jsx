import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`transition-colors duration-150 font-medium ${
        isActive(to)
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-blue-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JobPortal</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'Home')}
            {navLink('/jobs', 'Find Jobs')}

            {user ? (
              <>
                {user.role === 'employer' && (
                  <>
                    {navLink('/employer/dashboard', 'Dashboard')}
                    {navLink('/employer/post-job', 'Post Job')}
                    {navLink('/employer/manage-jobs', 'Manage Jobs')}
                  </>
                )}
                {user.role === 'candidate' && (
                  navLink('/candidate/applied-jobs', 'My Applications')
                )}
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-4 px-2">
            {navLink('/', 'Home')}
            {navLink('/jobs', 'Find Jobs')}
            {user ? (
              <>
                {user.role === 'employer' && (
                  <>
                    {navLink('/employer/dashboard', 'Dashboard')}
                    {navLink('/employer/post-job', 'Post Job')}
                    {navLink('/employer/manage-jobs', 'Manage Jobs')}
                  </>
                )}
                {user.role === 'candidate' && navLink('/candidate/applied-jobs', 'My Applications')}
                <span className="text-sm text-gray-500">Signed in as {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium w-fit hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-fit">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
