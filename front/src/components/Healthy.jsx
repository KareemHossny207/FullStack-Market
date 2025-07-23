import React, { useContext } from 'react'
import { ShopContext } from '../ShopContext'

const Healthy = () => {
  const { 
    allproducts, 
    addToCart, 
    getProductById, 
    searchResults 
  } = useContext(ShopContext);

  // Use search results if available, otherwise use all products
  const productsToShow = searchResults.length > 0 ? searchResults : allproducts;
  
  const HealthyProducts = productsToShow.filter(
    (item) => item.category === "Organic & Healthy Living"
  );
  // Group products by subcategory
  const groupedBySubcategory = HealthyProducts.reduce((acc, item) => {
    const subcat = item.subcategory || "Other";
    if (!acc[subcat]) acc[subcat] = [];
    acc[subcat].push(item);
    return acc;
  }, {});
  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-extrabold text-green-700 tracking-tight">Organic & Healthy Living</h3>
      </div>
      {/* Use useNavigate to go to product details on click */}
      {Object.entries(groupedBySubcategory).map(([subcategory, items]) => (
        <div key={subcategory} className="mb-10">
          <h4 className="text-xl font-bold text-green-600 mb-4">{subcategory}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col items-center p-4 cursor-pointer"
                onClick={() => window.location.href = `/product/${item._id}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-contain mb-3 rounded-lg bg-green-50"
                />
                <h5 className="text-lg font-semibold text-green-800 mb-1 text-center">{item.name}</h5>
                <p className="text-gray-500 text-sm mb-2 text-center line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-green-700 font-bold text-lg">${item.price}</span>
                  {item.oldprice && (
                    <span className="text-gray-400 line-through text-base">
                      ${item.oldprice}
                    </span>
                  )}
                </div>
                <button
                  className={`mt-4 px-4 py-2 rounded-full font-semibold transition ${
                    item.outOfStock
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  onClick={e => {
                    // Prevents the click event from bubbling up to the parent div,
                    // so clicking "Add to Cart" doesn't trigger navigation to the product page like the all div.
                    e.stopPropagation();
                    addToCart(item._id);
                  }}
                  disabled={item.outOfStock}
                >
                  {item.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div> 
     )
}

export default Healthy