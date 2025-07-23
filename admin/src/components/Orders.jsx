import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { HiOutlineClipboardList, HiCheckCircle, HiXCircle, HiTruck, HiRefresh } from 'react-icons/hi';

// Helper to format address (object or string)
function formatAddress(address) {
  if (!address) return <span className="text-gray-500">No address provided.</span>;
  if (typeof address === 'string') return address;
  if (typeof address === 'object') {
    return (
      <div className="text-xs">
        <p className="font-bold">{address.fullName}</p>
        <p>{address.address}</p>
        <p>{`${address.city}, ${address.postalCode}`}</p>
        {address.phone && <p>Phone: {address.phone}</p>}
        {address.email && <p>Email: {address.email}</p>}
        {address.notes && <p>Notes: {address.notes}</p>}
      </div>
    );
  }
  return <span className="text-red-500">Invalid address format.</span>;
}

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
const statusIcons = {
  Pending: <HiOutlineClipboardList className="inline text-yellow-500 text-lg mr-1 align-middle" />,
  Shipped: <HiTruck className="inline text-blue-500 text-lg mr-1 align-middle" />,
  Delivered: <HiCheckCircle className="inline text-green-600 text-lg mr-1 align-middle" />,
  Cancelled: <HiXCircle className="inline text-red-500 text-lg mr-1 align-middle" />,
};

const API_BASE = 'http://localhost:7777/api/order';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({}); // { [orderId]: true/false }

  // Fetch all orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE}/adminOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError(res.data.message || 'Failed to fetch orders');
          toast.error(res.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        toast.error('Error fetching orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await axios.put(
        `${API_BASE}/status`,
        { orderId, status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(
          <span>
            {statusIcons[newStatus]}
            Status updated to <b>{newStatus}</b>
          </span>
        );
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating status');
    }
    setUpdating((prev) => ({ ...prev, [orderId]: false }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px] text-green-700">
        <HiRefresh className="animate-spin mr-2 text-2xl" />
        Loading orders...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-600 font-semibold py-4">{error}</div>
    );

  return (
    <div className="bg-white shadow-md rounded-3xl p-4 sm:p-6 mt-4 border border-green-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-6 text-green-800 text-center tracking-tight drop-shadow-sm flex items-center justify-center gap-2">
        <HiOutlineClipboardList className="text-3xl text-green-600" /> All Orders
      </h2>
      {/* Responsive Table for md+ and Cards for mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-green-100">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">User ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Change Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-green-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-green-400">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-3 font-mono text-xs text-green-900">{order._id}</td>
                  <td className="px-4 py-3 text-green-900">{order.userId}</td>
                  <td className="px-4 py-3">
                    <ul className="list-disc list-inside space-y-1">
                      {order.items && order.items.map((item, idx) => (
                        <li key={idx} className="text-green-700 text-sm">
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-green-700 font-bold">{order.amount}</td>
                  <td className="px-4 py-3 text-green-700">{formatAddress(order.address)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow flex items-center gap-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{statusIcons[order.status || 'Pending']}{order.status || 'Pending'}</span>
                  </td>
                  <td className="px-4 py-3 text-green-700 text-xs">{order.date ? new Date(order.date).toLocaleString() : ''}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updating[order._id]}
                      className="rounded-full border border-green-200 px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm transition"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    {updating[order._id] && <HiRefresh className="ml-2 text-green-500 text-lg animate-spin inline align-middle" title="Updating..." />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Card layout for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {orders.length === 0 ? (
          <div className="text-center py-6 text-green-400 bg-white rounded-xl shadow">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-green-100">
              <div className="flex flex-wrap gap-2 text-xs mb-2 items-center">
                <span className="font-mono text-green-700">{order._id}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">User: {order.userId}</span>
                <span className={`px-2 py-1 rounded-full font-semibold shadow flex items-center gap-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{statusIcons[order.status || 'Pending']}{order.status || 'Pending'}</span>
              </div>
              <div className="text-green-700 font-bold">Amount: {order.amount}</div>
              <div className="text-green-700">Address: {formatAddress(order.address)}</div>
              <div className="text-green-700 text-xs">{order.date ? new Date(order.date).toLocaleString() : ''}</div>
              <div className="mt-2">
                <ul className="list-disc list-inside space-y-1">
                  {order.items && order.items.map((item, idx) => (
                    <li key={idx} className="text-green-700 text-sm">
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <select
                  value={order.status || 'Pending'}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  disabled={updating[order._id]}
                  className="flex-1 rounded-full border border-green-200 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm transition"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {updating[order._id] && <HiRefresh className="text-green-500 text-lg animate-spin inline align-middle" title="Updating..." />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;