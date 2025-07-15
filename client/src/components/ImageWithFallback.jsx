import { useState } from "react";

// Pastel colors for each category
const categoryColors = {
  "Beverages": "#fecaca",
  "Dairy": "#fcd34d",
  "Bakery": "#a5f3fc",
  "Frozen Foods": "#c4b5fd",
  "Fruits & Vegetables": "#bbf7d0",
  "Ready-to-Eat Meals": "#fdba74",
  "Packaged Foods": "#fbcfe8",
  "Fresh Juices": "#6ee7b7",
  "Condiments & Sauces": "#fecaca",
  "Fermented Products": "#e5e7eb",
};

const getCategoryColor = (category) =>
  categoryColors[category?.trim()] || "#e5e7eb"; // fallback gray

const ImageWithFallback = ({
  src,
  alt = "Product",
  productName,
  companyName,
  category,
  className = "",
  size = 96,
}) => {
  const [error, setError] = useState(!src);
  const bgColor = getCategoryColor(category);

  if (!src || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center rounded-full shadow ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
        }}
      >
        <span className="text-sm font-semibold text-black px-2">
          {productName}
        </span>
        <span className="text-xs text-gray-600 font-bold px-2">
          ({companyName})
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;
