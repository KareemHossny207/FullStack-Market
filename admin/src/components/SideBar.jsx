import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlinePlusCircle, HiOutlineCollection, HiOutlineClipboardList } from 'react-icons/hi';

const links = [
  { name: 'DashBoard', path: '/', icon: <HiOutlineViewGrid /> },
  { name: 'Add Product', path: '/AddProduct', icon: <HiOutlinePlusCircle /> },
  { name: 'All Products', path: '/AllProducts', icon: <HiOutlineCollection /> },
  { name: 'Orders', path: '/Orders', icon: <HiOutlineClipboardList /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen bg-gradient-to-b from-green-50 via-white to-green-100 text-green-900 flex w-1/4 flex-col py-8 px-4 shadow-xl rounded-r-3xl border-r border-green-200">
      <nav className="flex-1 flex flex-col gap-10 mt-4">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-150 text-sm flex-col text-center md:flex-row md:text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 select-none ${
              location.pathname === link.path
                ? 'bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold scale-105'
                : 'hover:bg-green-100 hover:text-green-700'
            }`}
          >
            <span className="text-2xl">{link.icon}</span>
            {link.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
