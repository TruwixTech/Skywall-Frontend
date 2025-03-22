import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

// Memoized components
const SaleBadge = memo(() => (
  <span className="absolute z-20 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
    Sale
  </span>
));

const OutOfStockBadge = memo(() => (
  <span className="absolute z-20 top-2 left-2 text-white text-sm px-3 py-1 rounded-full bg-red-600">
    Out of Stock
  </span>
));

const ImageHolder = memo(({ images, name }) => (
  <div className="relative w-full h-60 rounded-md overflow-hidden">
    <img
      src={images[0]}
      alt={name}
      loading="lazy"
      decoding="async"
      className={`${images.length > 1 ? "group-hover:opacity-0" : ""} absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100`}
    />
    {images.length > 1 && (
      <img
        src={images[1]}
        alt={name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
      />
    )}
  </div>
));

const PriceSection = memo(({ price, newPrice }) => (
  <div className="mt-2">
    <span className="text-gray-400 line-through text-sm">
      Rs. {price}
    </span>
    <span className="text-black text-lg ml-2">
      Rs. {newPrice}
    </span>
  </div>
));

const ProductCard = memo(({ product }) => (
  <Link 
    to={`/television/${product._id}`}
    className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
  >
    {product.stock > 0 ? <SaleBadge /> : <OutOfStockBadge />}
    
    <ImageHolder images={product.image} name={product.name} />
    
    <h3 className="text-gray-800 font-semibold mt-3 transition-all duration-300 ease-in-out group-hover:underline group-hover:underline-offset-4">
      {product?.name}
    </h3>
    
    <p className="text-gray-500 text-sm uppercase mt-1">
      {product?.companyName}™ TV
    </p>
    
    <PriceSection price={product?.price} newPrice={product?.new_price} />
  </Link>
));

const LoadingSpinner = memo(() => (
  <div className="w-full h-80 flex justify-center items-center">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
));

function TelevisionCollections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend}/product/list`, {
        pageNum: 1,
        pageSize: 12,
        filters: {},
      });

      if (response.data.status === "Success") {
        setProducts(response.data.data.productList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const productGrid = useMemo(() => (
    <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 cursor-pointer">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  ), [products]);

  return (
    <div className="w-full h-auto flex flex-col px-5 md:px-10 lg:px-20 xl:px-32 py-10 gap-8 lg:gap-12">
      <h1 className="font-semibold text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
        Televisions Collections
      </h1>
      {loading ? <LoadingSpinner /> : productGrid}
    </div>
  );
}

export default memo(TelevisionCollections);