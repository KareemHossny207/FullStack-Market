import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart } from "react-icons/hi";

const NavBar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    if (setToken) setToken(null);
    navigate('/login');
  };

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 bg-gradient-to-r from-green-50 via-white to-green-100 text-green-900 shadow-lg">
      {/* Logo */}
      <div
        className="logo flex items-center gap-2 font-extrabold text-2xl cursor-pointer select-none tracking-tight transition-transform duration-200 hover:scale-105"
        onClick={() => navigate('/')}
      >
        <span className="text-green-700 drop-shadow-sm">Market</span>
        <span  className="icon text-green-600 text-3xl flex items-center transition-transform duration-200">
          <HiOutlineShoppingCart />
        </span>
      </div>
      {/* Logout Link */}
      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-red-500 hover:to-red-700 h-10 px-6 text-white rounded-full font-semibold shadow-lg transition-all duration-400 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 text-base"
          onClick={() => setToken('')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;