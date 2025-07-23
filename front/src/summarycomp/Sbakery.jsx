import React, { useContext } from 'react'
import { ShopContext } from '../ShopContext'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Sbakery = () => {
  const { allproducts, addToCart, searchResults } = useContext(ShopContext)
  const navigate = useNavigate()

  // Use search results if available, otherwise use all products
  const productsToShow = searchResults.length > 0 ? searchResults : allproducts

  const Products = productsToShow.filter(
    (item) => item.category === "Bakery & Biscuits"
  )

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      <style jsx>{`
        .baby-swiper {
          padding-bottom: 50px;
        }
        
        .baby-swiper .swiper-button-next,
        .baby-swiper .swiper-button-prev {
          color: #16a34a;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .baby-swiper .swiper-button-next:hover,
        .baby-swiper .swiper-button-prev:hover {
          background: #16a34a;
          color: white;
          transform: scale(1.1);
        }
        
        .baby-swiper .swiper-button-next::after,
        .baby-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
        
        .baby-swiper .swiper-pagination-bullet {
          background: #d1fae5;
          opacity: 0.7;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        
        .baby-swiper .swiper-pagination-bullet-active {
          background: #16a34a;
          opacity: 1;
          transform: scale(1.2);
        }
        
        .baby-swiper .swiper-pagination {
          bottom: 10px;
        }
      `}</style>
      
      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-3xl font-extrabold text-green-700 tracking-tight">Bakery & Biscuits</h3>
        <button
          className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition"
          onClick={() => navigate("/Bakery")}
        >
          View All
        </button>
      </div>
      
      {Products.length > 0 && (
        <div className="mb-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            className="baby-swiper"
          >
            {Products.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col items-center p-4 cursor-pointer h-full"
                  onClick={() => navigate(`/product/${item._id}`)}
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
                      e.stopPropagation();
                      addToCart(item._id);
                    }}
                    disabled={item.outOfStock}
                  >
                    {item.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}

export default Sbakery