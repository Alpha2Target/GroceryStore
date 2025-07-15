import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import ImageWithFallback from "./ImageWithFallback";
const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        onClick={() => {
          navigate(`/product/${product.category.toLowerCase()}/${product?._id}`);
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
      >
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <ImageWithFallback
            src={product.image?.[0] && `http://localhost:5000/images/${product.image[0]}`}
            productName={product.name}
            category={product.category}
            companyName={product.company}
            size={96}
            className="group-hover:scale-105 transition"
          />
        </div>

        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.company}
          </p>

          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-3 md:w-3.5"
                />
              ))}
            <p>(4)</p>
          </div>
          <p className="text-gray-500/60 text-md">
            {product.daysToExpiry} days to expiry
          </p>
        
          
          

          <div className="flex items-end justify-between mt-3">
            <div className="flex flex-col">
              <div className="md:text-xl text-base font-medium text-indigo-500">
                ₹{product.offerPrice}{" "}
                <span className="text-gray-500/60 md:text-sm text-xs line-through">
                  ₹{product.price}
                </span>
              </div>

              {/* Optional: Discount badge */}
              {product.offerPrice < product.price && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-1 w-fit">
                  {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </span>
              )}
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500"
            >
              {!cartItems?.[product?._id] ? (
                <button
                  onClick={() => addToCart(product?._id)}
                  className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium cursor-pointer"
                >
                  <img src={assets.cart_icon} alt="cart icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(product?._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[product?._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
