import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllProducts = ({token}) => {
const [all, setAll] = useState([]);
const [loading, setLoading] = useState({});
const API_URL = process.env.REACT_APP_API_URL;

const fetchAllProducts = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/product/all`);
    if (res.data && res.data.success) {
      setAll(res.data.products || []);
    } else {
      toast.error("Can't get the Products");
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Error fetching products");
  }
};

// Delete product function
const handleDeleteProduct = async (productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }

  setLoading(prev => ({ ...prev, [`delete-${productId}`]: true }));
  
  try {
    const res = await axios.delete(
      `${API_URL}/product/remove/${productId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    
    if (res.data && res.data.success) {
      toast.success('Product deleted successfully!');
      fetchAllProducts(); // Refresh the list
    } else {
      toast.error(res.data?.message || 'Failed to delete product');
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || 'Error deleting product');
  } finally {
    setLoading(prev => ({ ...prev, [`delete-${productId}`]: false }));
  }
};

// Update stock function
const handleUpdateStock = async (productId, currentStockStatus) => {
  setLoading(prev => ({ ...prev, [`stock-${productId}`]: true }));
  
  try {
    const res = await axios.put(
      `${API_URL}/product/stock/${productId}`,
      {
        outOfStock: !currentStockStatus
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (res.data && res.data.success) {
      toast.success('Stock status updated successfully!');
      fetchAllProducts(); // Refresh the list
    } else {
      toast.error(res.data?.message || 'Failed to update stock status');
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || 'Error updating stock status');
  } finally {
    setLoading(prev => ({ ...prev, [`stock-${productId}`]: false }));
  }
};

useEffect(() => {
  if (token) {
    fetchAllProducts();
  }
}, [token]);

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-green-100 shadow-xl rounded-3xl p-4 sm:p-6 mt-4 border border-green-200">
      <h2 className="text-2xl font-extrabold mb-6 text-green-800 text-center tracking-tight drop-shadow-sm">All Products</h2>
      {/* Responsive Table for md+ and Cards for mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Old Price</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Subcategory</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-100">
            {all.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-green-400">No products found.</td>
              </tr>
            ) : (
              all.map((item, idx) => (
                <tr key={idx} className="hover:bg-green-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border border-green-200 shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-900">{item.name}</td>
                  <td className="px-4 py-3 text-green-700 font-bold">₹{item.price}</td>
                  <td className="px-4 py-3 text-green-400 line-through">{item.oldprice ? `₹${item.oldprice}` : '-'}</td>
                  <td className="px-4 py-3">{item.category || '-'}</td>
                  <td className="px-4 py-3">{item.subcategory || '-'}</td>
                  <td className="px-4 py-3">
                    {item.outOfStock ? (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold shadow">Out of Stock</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold shadow">In Stock</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStock(item._id, item.outOfStock)}
                        disabled={loading[`stock-${item._id}`]}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-green-400 select-none ${
                          item.outOfStock 
                            ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white' 
                            : 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white'
                        } ${loading[`stock-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading[`stock-${item._id}`] ? 'Updating...' : item.outOfStock ? 'Set In Stock' : 'Set Out of Stock'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item._id)}
                        disabled={loading[`delete-${item._id}`]}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400 select-none ${
                          loading[`delete-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading[`delete-${item._id}`] ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Card layout for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {all.length === 0 ? (
          <div className="text-center py-6 text-green-400 bg-white rounded-xl shadow">No products found.</div>
        ) : (
          all.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-green-100">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border border-green-200 shadow-sm" />
                <div className="flex-1">
                  <div className="font-bold text-green-900 text-lg">{item.name}</div>
                  <div className="text-green-700 font-bold">₹{item.price}</div>
                  <div className="text-green-400 line-through text-sm">{item.oldprice ? `₹${item.oldprice}` : '-'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">{item.category || '-'}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">{item.subcategory || '-'}</span>
                {item.outOfStock ? (
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold shadow">Out of Stock</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold shadow">In Stock</span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleUpdateStock(item._id, item.outOfStock)}
                  disabled={loading[`stock-${item._id}`]}
                  className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-green-400 select-none ${
                    item.outOfStock 
                      ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white' 
                      : 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white'
                  } ${loading[`stock-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading[`stock-${item._id}`] ? 'Updating...' : item.outOfStock ? 'Set In Stock' : 'Set Out of Stock'}
                </button>
                <button
                  onClick={() => handleDeleteProduct(item._id)}
                  disabled={loading[`delete-${item._id}`]}
                  className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-400 select-none ${
                    loading[`delete-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading[`delete-${item._id}`] ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AllProducts