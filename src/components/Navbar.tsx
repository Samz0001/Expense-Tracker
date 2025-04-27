import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Music, History, LogOut, User, LogIn } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="backdrop-blur-md bg-black/30 border-b border-white/10 shadow-lg w-full ">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-white hover:scale-105 transition-transform"
        >
          <Music className="text-purple-400 animate-pulse" size={26} />
          <span className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
            MoodMusic
          </span>
        </Link>

        <div className="flex items-center space-x-5">
          {user ? (
            <>
              <Link
                to="/history"
                className="text-white hover:text-indigo-300 transition duration-300 flex items-center"
              >
                <History className="mr-1" size={18} />
                <span>History</span>
              </Link>

              <div className="text-white flex items-center gap-1 font-medium">
                <User size={18} />
                <span className="hidden sm:inline">{user.username}</span>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full hover:opacity-90 transition shadow-md"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-indigo-300 transition duration-300 flex items-center"
              >
                <LogIn className="mr-1" size={18} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
