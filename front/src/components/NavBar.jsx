import React, { useState, useContext } from 'react';
import { HiOutlineShoppingCart, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiShoppingCart } from 'react-icons/fi';
import { CiSearch } from "react-icons/ci";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from "../ShopContext";

const NavBar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, token, setToken, setUser ,setShowSearch} = useContext(ShopContext);

  // Helper to check if a path is active
  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-green-50 via-white to-green-100 text-green-900  shadow-md px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Logo */}
      <div
        className="logo flex items-center gap-2 font-extrabold text-2xl cursor-pointer select-none tracking-tight transition-transform duration-200 hover:scale-105"
        onClick={() => navigate('/')}
      >
        <span className="text-green-700 drop-shadow-sm">Market</span>
        <span className="icon text-green-600 text-3xl flex items-center transition-transform duration-200">
          <HiOutlineShoppingCart className="w-8 h-8" />
        </span>
      </div>
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-150 text-ld font-medium shadow-sm select-none hover:text-green-700">
        <NavLink
          to="/"
          className={() =>
            `transition px-3 py-1 rounded-full ${
              isActivePath("/")
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold scale-105"
                : "text-green-800 font-semibold hover:text-green-600 hover:bg-green-100"
            }`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/About"
          className={() =>
            `transition px-3 py-1 rounded-full ${
              isActivePath("/About")
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold scale-105"
                : "text-green-800 font-semibold hover:text-green-600 hover:bg-green-100"
            }`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/Contact"
          className={() =>
            `transition px-3 py-1 rounded-full ${
              isActivePath("/Contact")
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold scale-105"
                : "text-green-800 font-semibold hover:text-green-600 hover:bg-green-100"
            }`
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/Orders"
          className={() =>
            `transition px-3 py-1 rounded-full ${
              isActivePath("/Orders")
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold scale-105"
                : "text-green-800 font-semibold hover:text-green-600 hover:bg-green-100"
            }`
          }
        >
          Orders
        </NavLink>
      </div>
      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <button
  onClick={() => {
    const productDetailsMatch = /^\/product\//.test(location.pathname);
    if (
      location.pathname === '/Orders' ||
      location.pathname === '/About' ||
      location.pathname === '/Login' ||
      location.pathname === '/Contact' ||
      productDetailsMatch
    ) {
      navigate('/');
      setTimeout(() => setShowSearch(true), 100); // ensure navigation before opening search
    } else {
      setShowSearch(true);
    }
  }}
  className="text-gray-600 hover:text-green-600 transition-colors duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-200"
  aria-label="Search"
  type="button"
>
  <CiSearch className="text-xl sm:text-2xl" />
        </button>
        {/* Cart Icon with count */}
        <NavLink
          to="/Cart"
          className="relative text-gray-600 hover:text-green-600 transition-colors duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-200"
          aria-label="Cart"
        >
          <FiShoppingCart className="text-xl sm:text-2xl" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {cartCount}
            </span>
          )}
        </NavLink>
        {/* Login/Logout Button */}
        {token && token !== '' && token !== undefined ? (
          <button
            onClick={() => {
              setToken('');
              setUser(null);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/Login');
            }}
            className="bg-red-200 text-red-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-red-600 hover:text-white transition text-sm sm:text-base"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/Login");
            }}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-green-200 transition text-sm sm:text-base"
          >
            Login
          </button>
        )}
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-green-100 transition"
          onClick={() => setShowMobileMenu(prev => !prev)}
          aria-label="Open menu"
          type="button"
        >
          <HiOutlineMenu className="w-7 h-7 text-green-700" />
        </button>
      </div>
      {/* Mobile Links */}
      {showMobileMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-40 transition-opacity duration-200">
          <div className="absolute top-0 right-0 w-3/4 max-w-xs bg-white h-full shadow-lg flex flex-col p-6 gap-6">
            <button
              className="self-end mb-4 p-2 rounded-full hover:bg-green-100 transition"
              onClick={() => setShowMobileMenu(false)}
              aria-label="Close menu"
              type="button"
            >
              <HiOutlineX className="w-7 h-7 text-green-700" />
            </button>
            <NavLink
              to="/"
              className={`font-semibold transition px-3 py-2 rounded-full ${
                isActivePath("/")
                  ? "bg-green-100 text-green-700"
                  : "text-green-800 hover:text-green-600 hover:bg-green-100"
              }`}
              onClick={() => setShowMobileMenu(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/About"
              className={`font-semibold transition px-3 py-2 rounded-full ${
                isActivePath("/About")
                  ? "bg-green-100 text-green-700"
                  : "text-green-800 hover:text-green-600 hover:bg-green-100"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/Cart"
              className={`font-semibold transition px-3 py-2 rounded-full ${
                isActivePath("/Cart")
                  ? "bg-green-100 text-green-700"
                  : "text-green-800 hover:text-green-600 hover:bg-green-100"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Cart
            </NavLink>
            <NavLink
              to="/Orders"
              className={`font-semibold transition px-3 py-2 rounded-full ${
                isActivePath("/Orders")
                  ? "bg-green-100 text-green-700"
                  : "text-green-800 hover:text-green-600 hover:bg-green-100"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Orders
            </NavLink>
            {!token && (
              <NavLink
                to="/Login"
                className={`px-4 py-2 rounded-full font-semibold shadow-sm transition text-sm sm:text-base ${
                  isActivePath("/Login")
                    ? "bg-green-100 text-green-700 "
                    : "text-green-800 hover:text-green-600 hover:bg-green-100"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Login
              </NavLink>
            )}
            {token && (
              <button
                onClick={() => {
                  setToken('');
                  localStorage.removeItem("token");
                  setShowMobileMenu(false);
                  navigate("/Login");
                }}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-green-200 transition text-sm sm:text-base"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar