import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Category = () => {
  const { products, navigate } = useAppContext();

  // Extract unique category names from products
  const categoriesFromDB = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  return (
    <div className="mt-16 px-4 pb-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
        Categories
      </h1>

      {categoriesFromDB.map((categoryName, index) => {
        const categoryProducts = products.filter(
          (product) =>
            product.category?.toLowerCase() === categoryName.toLowerCase()
        );

        return (
          <section key={index} className="mb-10">
            {/* Category Title */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                {/* No image available in DB, using placeholder */}
                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                  {categoryName.charAt(0)}
                </div>
                <h2 className="text-xl md:text-2xl font-semibold capitalize">
                  {categoryName}
                </h2>
              </div>
              <button
                onClick={() => {
                  navigate(`/products/${categoryName.toLowerCase()}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                View All
              </button>
            </div>

            {/* Product Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                No products available in this category.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default Category;
