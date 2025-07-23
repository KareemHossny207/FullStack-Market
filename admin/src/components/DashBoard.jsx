import React, { useEffect, useState } from 'react'
import { FaUsers, FaBoxOpen, FaShoppingCart, FaChartLine } from 'react-icons/fa'
import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

const DashBoard = ({ token }) => {
  const [stats, setStats] = useState({ products: null, orders: null, sales: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch products
        const prodRes = await axios.get(`${API_URL}/product/all`);
        const products = prodRes.data.count || (prodRes.data.products ? prodRes.data.products.length : 0);
        // Fetch orders
        const orderRes = await axios.get(`${API_URL}/order/adminOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersArr = orderRes.data.orders || [];
        const orders = ordersArr.length;
        // Calculate sales
        const sales = ordersArr.reduce((sum, order) => sum + (order.amount || 0), 0);
        setStats({ products, orders, sales });
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      }
      setLoading(false);
    };
    if (token) fetchStats();
  }, [token]);

  const features = [
    {
      label: 'Products',
      icon: <FaBoxOpen className="text-3xl text-green-500" />,
      value: stats.products !== null ? stats.products : '...',
    },
    {
      label: 'Orders',
      icon: <FaShoppingCart className="text-3xl text-yellow-500" />,
      value: stats.orders !== null ? stats.orders : '...',
    },
    {
      label: 'Sales',
      icon: <FaChartLine className="text-3xl text-purple-500" />,
      value: stats.sales !== null ? `$${stats.sales}` : '...',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading ? (
        <div className="text-center text-green-700">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-2">{feature.icon}</div>
              <div className="text-lg font-semibold">{feature.label}</div>
              <div className="text-2xl font-bold mt-1">{feature.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashBoard