import React, { useState, useEffect} from 'react'
import { createContext } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext()
const ShopProvider = (props) => {

    const [allproducts, setAllproducts] = useState([])
    const [cart,setCart]=useState([])
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState(() => {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    });
    const navigate = useNavigate();

    const API_URL = "https://backend-market-one.vercel.app/api";

      // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        } else {
          // If the saved cart is not an array, remove it.
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

    const fetchAllProducts = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/product/all`);
          if (res.data && res.data.success) {
            setAllproducts(res.data.products || []);
          } else {
            toast.error("Can't get the Products");
          }
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || "Error getting products");
        }
      };

    // Helper to get token
    const getToken = () => localStorage.getItem("token");

    // Get cart data
    const getCart = async () => {
      try {
        const token = getToken();
        if (!token) {
          setCart([]);
          setCartTotal(0);
          setCartCount(0);
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.post(
          `${API_URL}/cart/get`,
          {},
          { headers }
        );
        if (res.data && res.data.success) {
          setCart(Array.isArray(res.data.cartItems) ? res.data.cartItems : []);
          setCartTotal(typeof res.data.totalAmount === "number" ? res.data.totalAmount : 0);
          setCartCount(typeof res.data.itemCount === "number" ? res.data.itemCount : 0);
        } else {
          setCart([]);
          setCartTotal(0);
          setCartCount(0);
        }
      } catch (err) {
        console.error("Get cart error", err);
        setCart([]);
        setCartTotal(0);
        setCartCount(0);
      }
    };

    // Add to cart
    const addToCart = async (itemId) => {
      try {
        const token = getToken(); // Use helper to get token
        if (!token) {
          toast.error("You must be logged in to add items to the cart.");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.post(
          `${API_URL}/cart/add`,
          { itemId },
          { headers }
        );
        if (res.data && res.data.success) {
          await getCart();
          toast.success("Product added Successfully");
        } else {
          toast.error(res.data?.message || "Failed to add product to cart");
        }
      } catch (err) {
        console.error("Add to cart error", err);
        toast.error(
          err?.response?.data?.message ||
          err?.message ||
          "Error adding product to cart"
        );
      }
    };

    // Update cart item quantity
    const updateCart = async (itemId, quantity) => {
      try {
        const res = await axios.put(
          `${API_URL}/cart/update`,
          { itemId, quantity },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (res.data.success) getCart();
      } catch (err) {
        console.error("Update cart error", err);
      }
    };

    // Remove from cart
    const removeFromCart = async (itemId) => {
      try {
        const res = await axios.delete(
          `${API_URL}/cart/remove/${itemId}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (res.data.success) getCart();
        toast.success("Product removed Successfully")
      } catch (err) {
        console.error("Remove from cart error", err);
        toast.error(err)
      }
    };

    // Clear cart
    const clearCart = async () => {
      try {
        const res = await axios.delete(
          `${API_URL}/cart/clear`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        if (res.data.success) getCart();
        toast.success("Cart Cleared Successfully")
      } catch (err) {
        console.error("Clear cart error", err);
        toast.error(err)
      }
    };

    // Fetch a single product by ID
    const getProductById = async (id) => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`);
          if (res.data && res.data.success) {
          return res.data.product;
        } else {
          toast.error("Product not found");
          return null;
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Error fetching product");
        return null;
      }
    };

 
    const searchProducts = (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      
      const filtered = allproducts.filter(product => 
        product.name && product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description && product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category && product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    };

    // Clear search and show all products
    const clearSearch = () => {
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    };

    const filterProducts = (query) => {
      if (!query.trim()) {
        setSearchResults(allproducts);
        return;
      }

    };

    useEffect(() => {
      fetchAllProducts()
      getCart();
    }, [])

    // Debounced search effect
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (searchQuery.trim().length > 0) {
          searchProducts(searchQuery.trim());
        } else {
          clearSearch();
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [searchQuery]);
    
    const value = {
        allproducts,
        setAllproducts,
        cart,
        cartTotal,
        cartCount,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        getCart,
        getProductById,
        API_URL,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        showSearch,
        setShowSearch,
        searchProducts,
        clearSearch,
        filterProducts,
        token, setToken,
        user, setUser,
        navigate
    }
    
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopProvider