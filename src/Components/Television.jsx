import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

function Television() {
  const [availability, setAvailability] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("Best selling");
  const [products, setProducts] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Price ranges
  const priceRanges = {
    All: { min: 0, max: Infinity },
    "Under ₹10,000": { min: 0, max: 10000 },
    "₹10,000 - ₹20,000": { min: 10000, max: 20000 },
    "₹20,000 - ₹30,000": { min: 20000, max: 30000 },
    "₹30,000 & Above": { min: 30000, max: Infinity },
  };

  // Fetch products with pagination
  async function fetchAllProducts() {
    try {
      const response = await axios.post(`${backend}/product/list`, {
        pageNum,
        pageSize: 20,
        filters: {},
      });

      if (response.data.status === "Success") {
        setProducts(response.data.data.productList);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, [pageNum]);

  // Filter & Sorting Logic
  const filteredTelevisions = products.filter((tv) => {
    const availabilityFilter =
      availability === "All" ||
      (availability === "In Stock" && tv.stock > 0) ||
      (availability === "Out of Stock" && tv.stock <= 0);

    const selectedRange = priceRanges[priceRange];
    const priceFilter =
      tv.price >= selectedRange.min && tv.price <= selectedRange.max;

    return availabilityFilter && priceFilter;
  });

  const sortedTelevisions = [...filteredTelevisions].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.new_price - b.new_price;
    if (sortBy === "Price: High to Low") return b.new_price - a.new_price;
    return 0;
  });

  return (
    <>
      <div>
        <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 flex justify-center md:justify-start text-2xl md:text-4xl">
          Televisions
        </h1>
      </div>

      <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-5 gap-8 lg:gap-10">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full py-4 px-6 border-b border-gray-300 text-black text-sm space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <span className="font-medium">Filter:</span>
            <select
              className="outline-none p-2 rounded-md cursor-pointer"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="All">All Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            <select
              className="outline-none p-2 rounded-md cursor-pointer"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="All">All Price Ranges</option>
              <option value="Under ₹10,000">Under ₹10,000</option>
              <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
              <option value="₹20,000 - ₹30,000">₹20,000 - ₹30,000</option>
              <option value="₹30,000 & Above">₹30,000 & Above</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <span className="font-medium">Sort by:</span>
            <select
              className="outline-none p-2 rounded-md cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 cursor-pointer">
          {sortedTelevisions.map((tv, index) => (
            <Link to={`/television/${tv._id}`} key={tv._id}>
              <div className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden">
                <span
                  className={`absolute z-20 top-2 left-2 text-white text-sm px-3 py-1 rounded-full ${tv.stock > 0 ? "bg-green-600" : "bg-red-600"
                    }`}
                >
                  {tv.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                {/* Product Images */}
                <div className="relative w-full h-60 rounded-md overflow-hidden">
                  <img
                    src={tv.image[0]}
                    alt={tv.name}
                    className={`${tv.image.length > 1 ? "group-hover:opacity-0" : ""} absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100`}
                  />
                  {tv.image.length > 1 && (
                    <img
                      src={tv.image[1]}
                      alt={tv.name}
                      className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                    />
                  )}
                </div>

                {/* Product Name */}
                <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline">
                  {tv.name}
                </h3>

                {/* Product Price */}
                <div className="mt-2">
                  <span className="text-gray-400 line-through text-sm">
                    Rs. {tv.price.toLocaleString()}
                  </span>
                  <span className="text-black text-lg ml-2">
                    Rs. {tv.new_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {
          totalPages > 1 && (
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setPageNum((prev) => Math.max(prev - 1, 1))}
                disabled={pageNum === 1}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4 font-medium text-lg flex justify-center items-center">Page {pageNum}</span>
              <button
                onClick={() => setPageNum((prev) => Math.min(prev + 1, totalPages))}
                disabled={pageNum >= totalPages}
                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )
        }
      </div>
    </>
  );
}

export default Television;
