import React, { useEffect, useState } from "react";
import TelevisionCard from "../../assets/productCard.jpg";
import TelevisionCardHover from "../../assets/productCardHover.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

function TelevisionCollections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchAllProducts() {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/product/list`, {
        pageNum: 1,
        pageSize: 12,
        filters: {},
      });

      if (response.data.status === "Success") {
        setProducts(response.data.data.productList);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

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

  return (
    <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-10 gap-8 lg:gap-12">
      <h1 className="font-semibold text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Televisions Collections
      </h1>
      {
        loading
          ? <div className="w-full h-80 flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          : <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 cursor-pointer ">
            {products.map((television, index) => (
              <Link to={`/television/${television._id}`} key={television._id}
                className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
              >
                {/* Sale Badge */}
                <span className="absolute z-20 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
                  Sale
                </span>

                {/* TV Images (With Fade Transition) */}
                {/* Product Images */}
                <div className="relative w-full h-60 rounded-md overflow-hidden">
                  <img
                    src={television.image[0]}
                    alt={television.name}
                    className={`${television.image.length > 1 ? "group-hover:opacity-0" : ""} absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100`}
                  />
                  {television.image.length > 1 && (
                    <img
                      src={television.image[1]}
                      alt={television.name}
                      className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                    />
                  )}
                </div>

                {/* TV Name */}
                <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline group-hover:underline-offset-4">
                  {television?.name}
                </h3>

                {/* TV Brand */}
                <p className="text-gray-500 text-sm uppercase mt-1">
                  {television?.companyName}™ TV
                </p>

                {/* Price Section */}
                <div className="mt-2">
                  <span className="text-gray-400 line-through text-sm">
                    Rs. {television?.price}
                  </span>
                  <span className="text-black text-lg ml-2">
                    Rs. {television?.new_price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
      }
    </div>
  );
}

export default TelevisionCollections;
