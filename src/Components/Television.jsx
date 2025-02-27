import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import TelevisionCard from "../assets/productCard.jpg";
import TelevisionCardHover from "../assets/productCardHover.jpg";

function Television() {
  const [availability, setAvailability] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("Best selling");

  const televisions = [
    {
      name: "SkyWall 65-inch 4K Ultra HD Smart TV",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 49999,
      discountedPrice: 38900,
      inStock: true,
    },
    {
      name: "SkyWall 80 cm (32 inches) Full HD Smart Android LED TV 32SWRR Pro (Frameless Edition) (Dolby Audio)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 19125,
      discountedPrice: 7999,
      inStock: true,
    },
    {
      name: "SkyWall 60.96 cm (24 inch) HD Ready LED TV 24SWATV With A+ Grade Panel (slim bezels)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 12999,
      discountedPrice: 5299,
      inStock: false,
    },
    {
      name: "SkyWall 80 cm (32 inches) Full HD Smart LED TV 32SW-Voice (Frameless Edition) | With Voice Assistant",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 21250,
      discountedPrice: 8499,
      inStock: true,
    },
    {
      name: "SkyWall 80 cm (32 inches) HD Ready LED TV 32SWATV With A+ Grade Panel (slim bezels)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 15810,
      discountedPrice: 6999,
      inStock: true,
    },
    {
      name: "SkyWall 102 cm (40 inches) Full HD Smart LED TV 40SWRR With Black (Frameless Edition) (Dolby Audio)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 25270,
      discountedPrice: 11999,
      inStock: false,
    },
    {
      name: "SkyWall 108 cm (43 inches) Full HD Smart LED TV 43SW-Voice (Frameless Edition) | With Voice Assistant",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 28499,
      discountedPrice: 13499,
      inStock: true,
    },
    {
      name: "SkyWall 139.7 cm (55 inches) 4K Ultra HD Smart LED TV 55SW4K-VS (Frameless Edition) Voice Assistant",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 38499,
      discountedPrice: 35499,
      inStock: true,
    },
    {
      name: "SkyWall 80 cm (32 inches) Full HD Smart Android LED TV 32SWRR Pro (Frameless Edition) (Dolby Audio)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 19125,
      discountedPrice: 7999,
      inStock: false,
    },
    {
      name: "SkyWall 60.96 cm (24 inch) HD Ready LED TV 24SWATV With A+ Grade Panel (slim bezels)",
      img: TelevisionCard,
      imgHover: TelevisionCardHover,
      company: "SkyWall",
      realPrice: 12999,
      discountedPrice: 5299,
      inStock: true,
    },
  ];

  // Price ranges
  const priceRanges = {
    All: { min: 0, max: Infinity },
    "Under ₹10,000": { min: 0, max: 10000 },
    "₹10,000 - ₹20,000": { min: 10000, max: 20000 },
    "₹20,000 - ₹30,000": { min: 20000, max: 30000 },
    "₹30,000 & Above": { min: 30000, max: Infinity },
  };

  // Filter & Sorting Logic
  const filteredTelevisions = televisions.filter((tv) => {
    // Filter by availability
    const availabilityFilter =
      availability === "All" ||
      (availability === "In Stock" && tv.inStock) ||
      (availability === "Out of Stock" && !tv.inStock);

    // Filter by price range
    const selectedRange = priceRanges[priceRange];
    const priceFilter =
      tv.discountedPrice >= selectedRange.min &&
      tv.discountedPrice <= selectedRange.max;

    return availabilityFilter && priceFilter;
  });

  const sortedTelevisions = [...filteredTelevisions].sort((a, b) => {
    if (sortBy === "Price: Low to High")
      return a.discountedPrice - b.discountedPrice;
    if (sortBy === "Price: High to Low")
      return b.discountedPrice - a.discountedPrice;
    return 0;
  });

  return (
    <>
      <div>
        <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 items-center flex text-center text-lg sm:text-xl md:text-2xl lg:text-4xl">
          Televisions
        </h1>
      </div>
      {/* Products Grid */}
      <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-5 gap-8 lg:gap-10">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full py-4 px-6 border-b border-gray-300 text-black text-sm space-y-4 md:space-y-0">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <span className="font-medium">Filter:</span>

            {/* Availability Filter */}
            <select
              className="outline-none p-2 rounded-md cursor-pointer w-fit sm:w-auto"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="All">All Availability</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Price Range Filter */}
            <select
              className="outline-none p-2 rounded-md cursor-pointer w-fit sm:w-auto"
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

          {/* Sort Section */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <span className="font-medium">Sort by:</span>
            <select
              className="outline-none p-2 rounded-md cursor-pointer w-fit "
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Best selling</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
            {/* <span className="text-gray-600">
              {sortedTelevisions.length} products
            </span> */}
          </div>
        </div>

        <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 cursor-pointer ">
          {sortedTelevisions.map((television, index) => (
            <div
              key={index}
              className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
            >
              {/* Sale Badge */}
              {/* <span className="absolute z-20 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
                Sale
              </span> */}

              {/* Stock Badge */}
              <span
                className={`absolute z-20 top-2 left-2 text-white text-sm px-3 py-1 rounded-full ${
                  television.inStock ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {television.inStock ? "In Stock" : "Out of Stock"}
              </span>

              {/* TV Images (With Fade Transition) */}
              <div className="relative w-full h-60 rounded-md overflow-hidden">
                <img
                  src={television.img}
                  alt="image"
                  className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                />
                <img
                  src={television.imgHover}
                  alt="hover image"
                  className="absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                />
              </div>

              {/* TV Name */}
              <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline group-hover:underline-offset-4">
                {television.name}
              </h3>

              {/* TV Brand */}
              <p className="text-gray-500 text-sm uppercase mt-1">
                {television.company}™ TV
              </p>

              {/* Price Section */}
              <div className="mt-2">
                <span className="text-gray-400 line-through text-sm">
                  Rs. {television.realPrice.toLocaleString()}
                </span>
                <span className="text-black text-lg ml-2">
                  Rs. {television.discountedPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Television;
