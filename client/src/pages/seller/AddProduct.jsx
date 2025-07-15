import { assets, categories } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState("");
  const [daysToExpiry, setDaysToExpiry] = useState("");
  const [demand, setDemand] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("company", company);
      formData.append("price", price);
      formData.append("inventory", inventory);
      formData.append("daysToExpiry", daysToExpiry);
      formData.append("demand", demand);

      files.forEach((file) => formData.append("image", file));

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success(data.message);
        // Clear form
        setName("");
        setDescription("");
        setCategory("");
        setCompany("");
        setPrice("");
        setInventory("");
        setDaysToExpiry("");
        setDemand("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-white">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    accept="image/*"
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <img
                    className="max-w-24 cursor-pointer"
                    src={
                      files[index]
                        ? URL.createObjectURL(files[index])
                        : assets.upload_area
                    }
                    alt="uploadArea"
                  />
                </label>
              ))}
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            placeholder="e.g., Milk"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label>Product Description</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="p-2 border rounded"
            placeholder="Describe the product"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label>Product Type (Category)</label>
          <select
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select category</option>
            {categories.map((c, i) => (
              <option key={i} value={c.path}>
                {c.path}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1">
          <label>Company Name</label>
          <input
            type="text"
            value={company}
            required
            onChange={(e) => setCompany(e.target.value)}
            className="p-2 border rounded"
            placeholder="e.g., Amul"
          />
        </div>

        {/* Price + Expiry + Inventory + Demand */}
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 w-32">
            <label>Base Price ₹</label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label>Days to Expiry</label>
            <input
              type="number"
              required
              value={daysToExpiry}
              onChange={(e) => setDaysToExpiry(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label>Inventory</label>
            <input
              type="number"
              required
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label>Demand (1–10)</label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        </div>

        <button className="px-6 py-2 bg-indigo-500 text-white rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
