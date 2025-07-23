import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../ShopContext';

const Productdetails = () => {
  const { id } = useParams();
  const { getProductById, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg font-semibold text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg font-semibold text-red-500">{error}</span>
      </div>
    );
  }

  // Check outOfStock status
  const outOfStock = !!product?.outOfStock;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1 flex justify-center items-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-64 h-64 object-contain rounded-lg border"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
          <p className="text-lg text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-green-600">${product.price}</span>
            {product.oldprice && (
              <span className="text-xl text-gray-400 line-through">${product.oldprice}</span>
            )}
          </div>
          {/* In Stock / Out of Stock indicator */}
          <div className="mb-2">
            {!outOfStock ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => addToCart(product._id)}
          className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={outOfStock}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Productdetails;