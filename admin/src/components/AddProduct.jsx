import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'

const AddProduct = ({ token }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    oldprice: '',
    category: '',
    subcategory: '',
    outOfStock: false,
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Validation
    if (!image) {
      setError('Product image is required.');
      toast.error(error)
      setLoading(false);
      return;
    }

    // Prepare form data
    // create a new FormData object to prepare the data for a multipart/form-data POST request.
    // This allows both the product information and the image to be sent together to the server.
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('image', image);

    try {
      // Get admin token from localStorage 
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/product/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data', // axios sets this automatically for FormData
          },
        }
      );
      toast.success('Product added successfully!')
      setForm({
        name: '',
        description: '',
        price: '',
        oldprice: '',
        category: '',
        subcategory: '',
        outOfStock: false,
      });
      setImage(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Failed to add product. '
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-form w-full max-w-full sm:max-w-lg md:max-w-xl mx-auto mt-6 sm:mt-10 md:mt-12 bg-gradient-to-b from-green-50 via-white to-green-100 shadow-xl rounded-3xl p-4 sm:p-8 md:p-10 border border-green-200">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-green-800 tracking-tight drop-shadow-sm">Add New Product</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-4 sm:gap-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base sm:text-lg font-medium transition w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border border-green-200 rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base resize-none transition w-full"
          rows={3}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="flex-1 border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base sm:text-lg font-medium transition w-full"
          />
          <input
            type="number"
            name="oldprice"
            placeholder="Old Price"
            value={form.oldprice}
            onChange={handleChange}
            className="flex-1 border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base sm:text-lg font-medium transition w-full"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-green-800 font-semibold mb-2 ml-1" htmlFor="category">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base font-medium transition"
              >
                <option value="">Select Category</option>
                <option value="Breakfast & Instant Food">Breakfast & Instant Food</option>
                <option value="Baby Care">Baby Care</option>
                <option value="Bakery & Biscuits">Bakery & Biscuits</option>
                <option value="Chicken, Meat & Fish">Chicken, Meat & Fish</option>
                <option value="Cleaning Essentials">Cleaning Essentials</option>
                <option value="Cold Drinks & Juices">Cold Drinks & Juices</option>
                <option value="Dairy, Bread & Eggs">Dairy, Bread & Eggs</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Masala, Oil & More">Masala, Oil & More</option>
                <option value="Organic & Healthy Living">Organic & Healthy Living</option>
                <option value="Pet Care">Pet Care</option>
                <option value="Sauces & Spreads">Sauces & Spreads</option>
                <option value="Snacks & Munchies">Snacks & Munchies</option>
                <option value="Tea, Coffee & Health Drink">Tea, Coffee & Health Drink</option>
              </select>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-green-800 font-semibold mb-2 ml-1" htmlFor="subcategory">
              Subcategory
            </label>
            <div className="relative">
              <select
                id="subcategory"
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                required
                className="w-full border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm text-base font-medium transition"
                disabled={!form.category}
              >
                <option value="">Select Subcategory</option>
                {form.category === "Breakfast & Instant Food" && (
                  <>
                    <option value="Deserts">Deserts</option>
                    <option value="Noudles">Noudles</option>
                    <option value="Soup">Soup</option>
                    <option value="Ready to Cook & Eat">Ready to Cook & Eat</option>
                  </>
                )}
                {form.category === "Baby Care" && (
                  <>
                    <option value="Baby Food">Baby Food</option>
                    <option value="Baby Accessories">Baby Accessories</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Baby Needs">Baby Needs</option>
                  </>
                )}
                {form.category === "Bakery & Biscuits" && (
                  <>
                    <option value="Cream Biscuits">Cream Biscuits</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Sweet & Salty">Sweet & Salty</option>
                    <option value="Healthy">Healthy</option>
                  </>
                )}
                {form.category === "Chicken, Meat & Fish" && (
                  <>
                    <option value="Chicken">Chicken</option>
                    <option value="Meat">Meat</option>
                    <option value="Fish & Seafood">Fish & Seafood</option>
                  </>
                )}
                {form.category === "Cleaning Essentials" && (
                  <>
                    <option value="Cleaning Tools">Cleaning Tools</option>
                    <option value="Dish Washing">Dish Washing</option>
                    <option value="Floor Cleaners">Floor Cleaners</option>
                  </>
                )}
                {form.category === "Cold Drinks & Juices" && (
                  <>
                    <option value="Energy Drinks">Energy Drinks</option>
                    <option value="Fruits Juices">Fruits Juices</option>
                    <option value="Soft Drinks">Soft Drinks</option>
                  </>
                )}
                {form.category === "Dairy, Bread & Eggs" && (
                  <>
                    <option value="Butter">Butter</option>
                    <option value="Bread">Bread</option>
                    <option value="Eggs">Eggs</option>
                  </>
                )}
                {form.category === "Fruits & Vegetables" && (
                  <>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                  </>
                )}
                {form.category === "Masala, Oil & More" && (
                  <>
                    <option value="Oil">Oil</option>
                    <option value="Powdered Spices">Powdered Spices</option>
                    <option value="Salt, Sugar & Jaggery">Salt, Sugar & Jaggery</option>
                  </>
                )}
                {form.category === "Organic & Healthy Living" && (
                  <>
                    <option value="Healthy Breakfast">Healthy Breakfast</option>
                    <option value="Waffers">Waffers</option>
                    <option value="Healthy Protien">Healthy Protien</option>
                  </>
                )}
                {form.category === "Pet Care" && (
                  <>
                    <option value="Cats">Cats</option>
                    <option value="Dogs">Dogs</option>
                  </>
                )}
                {form.category === "Sauces & Spreads" && (
                  <>
                    <option value="Asian">Asian</option>
                    <option value="Indian">Indian</option>
                    <option value="Tomato & ketchap">Tomato & ketchap</option>
                  </>
                )}
                {form.category === "Snacks & Munchies" && (
                  <>
                    <option value="Pop Corn">Pop Corn</option>
                    <option value="Chips & Crisps">Chips & Crisps</option>
                    <option value="Ice Cream">Ice Cream</option>
                    <option value="Chocolates">Chocolates</option>
                  </>
                )}
                {form.category === "Tea, Coffee & Health Drink" && (
                  <>
                    <option value="Tea">Tea</option>
                    <option value="Coffe">Coffe</option>
                    <option value="Cold Coffe">Cold Coffe</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-green-800 font-semibold mb-2 ml-1" htmlFor="image">
            Product Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full border border-green-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition"
          />
        </div>
        {image && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl mt-2 border border-green-200 shadow"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 sm:py-3 px-4 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 text-base sm:text-lg ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;