import React from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const Footer = () => {
  const navigate=useNavigate()
  return (
    <footer className="w-full bg-gradient-to-r from-green-50 via-white to-green-100 border-t border-green-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left: Logo & Name */}
        <div className="flex flex-col items-start gap-4 w-full md:w-1/3">
        <div
        className="logo flex items-center gap-2 font-extrabold text-2xl cursor-pointer select-none tracking-tight transition-transform duration-200 hover:scale-105"
        onClick={() => navigate('/')}
      >
        <span className="text-green-700 drop-shadow-sm">Market</span>
        <span className="icon text-green-600 text-3xl flex items-center transition-transform duration-200">
          <HiOutlineShoppingCart className="w-8 h-8" />
        </span>
      </div>
          <div className="flex items-center gap-2 text-green-800 text-sm flex-wrap">
            <FaMapMarkerAlt className="text-green-500" />
            <span>123 Green Street, Cityville</span>
          </div>
          <div className="flex items-center gap-2 text-green-800 text-sm flex-wrap">
            <FaPhoneAlt className="text-green-500" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-green-800 text-sm flex-wrap">
            <FaEnvelope className="text-green-500" />
            <span>support@market.com</span>
          </div>
        </div>
        {/* Center: Links */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3  md:mt-16">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-green-800 text-base font-medium">
            <a href="/" className="hover:text-green-600 transition">Home</a>
            <a href="/About" className="hover:text-green-600 transition">About</a>
            <a href="/Contact" className="hover:text-green-600 transition">Contact</a>
            <a href="/Orders" className="hover:text-green-600 transition">Orders</a>
            <a href="/Cart" className="hover:text-green-600 transition">Cart</a>
          </div>
        </div>
        {/* Right: Social Icons */}
        <div className="flex gap-10  items-center justify-center w-full md:w-1/3 md:mt-16">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-green-700 hover:text-green-500 transition">
            <FaFacebookF className="w-5 h-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-green-700 hover:text-green-500 transition">
            <FaTwitter className="w-5 h-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-green-700 hover:text-green-500 transition">
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="text-green-700 text-xs text-center py-2">
        &copy; {new Date().getFullYear()} Market. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer