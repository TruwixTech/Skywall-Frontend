import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Check,
  ChevronDown,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

// This would be replaced with real data in your application
const getTelevisionById = (id) => {
  // Sample data for demo purposes
  return {
    id,
    name: "SkyWall 80 cm (32 inches) Full HD Smart Android LED TV 32SWRR Pro (Frameless Edition) (Dolby Audio)",
    company: "SkyWall",
    realPrice: 19125,
    discountedPrice: 7999,
    discount: 58,
    inStock: true,
    rating: 4.5,
    reviewCount: 217,
    description:
      "Experience stunning visuals with SkyWall's 32-inch Full HD Smart Android LED TV. This frameless edition features Dolby Audio for an immersive sound experience, making it perfect for your living room or bedroom.",
    images: [
      "/api/placeholder/500/400", // These would be replaced with actual image paths
      "/api/placeholder/500/400",
      "/api/placeholder/500/400",
      "/api/placeholder/500/400",
    ],
    highlights: [
      "Resolution: 1920 x 1080 Full HD",
      "Display: A+ Grade Panel with 178° wide viewing angle",
      "Sound: 20W Output with Dolby Audio",
      "Smart Features: Android TV with built-in Chromecast",
      "Connectivity: 2 HDMI, 2 USB, Wi-Fi",
    ],
    specifications: [
      {
        category: "Display",
        details: [
          { name: "Screen Size", value: "80 cm (32 inches)" },
          { name: "Resolution", value: "Full HD (1920 x 1080)" },
          { name: "Panel Type", value: "LED" },
          { name: "Refresh Rate", value: "60 Hz" },
          { name: "Viewing Angle", value: "178°" },
        ],
      },
      {
        category: "Sound",
        details: [
          { name: "Sound Output", value: "20 Watts" },
          { name: "Speaker Type", value: "Box Speakers" },
          { name: "Sound Technology", value: "Dolby Audio" },
        ],
      },
      {
        category: "Smart Features",
        details: [
          { name: "Operating System", value: "Android TV 11" },
          { name: "App Store", value: "Google Play Store" },
          { name: "Voice Assistant", value: "Google Assistant" },
          { name: "Built-in Chromecast", value: "Yes" },
        ],
      },
      {
        category: "Connectivity",
        details: [
          { name: "HDMI Ports", value: "2" },
          { name: "USB Ports", value: "2" },
          { name: "Bluetooth", value: "Version 5.0" },
          { name: "Wi-Fi", value: "2.4 GHz" },
        ],
      },
      {
        category: "Power",
        details: [
          { name: "Power Consumption", value: "60 Watts" },
          { name: "Power Supply", value: "AC 100-240V 50/60Hz" },
        ],
      },
      {
        category: "General",
        details: [
          { name: "Model", value: "32SWRR Pro" },
          { name: "Warranty", value: "1 Year Standard Warranty" },
          {
            name: "Box Contents",
            value:
              "LED TV, Remote, Batteries, Power Cord, User Manual, Wall Mount",
          },
        ],
      },
    ],
    reviews: [
      {
        name: "Amit Kumar",
        rating: 5,
        date: "15 Jan 2025",
        title: "Excellent TV for the price",
        comment:
          "The picture quality is amazing at this price point. The smart features work smoothly and the setup was very easy. Sound quality is good but I connected external speakers for a better experience.",
      },
      {
        name: "Priya Singh",
        rating: 4,
        date: "2 Feb 2025",
        title: "Great value for money",
        comment:
          "This TV exceeded my expectations. The frameless design looks premium and the Android interface is quite responsive. Only downside is the remote which feels a bit cheap.",
      },
      {
        name: "Rajesh Sharma",
        rating: 5,
        date: "20 Jan 2025",
        title: "Perfect for small rooms",
        comment:
          "Bought this for my parents' bedroom and they love it. The picture clarity is excellent and the sound is good enough for a small room. Very happy with this purchase.",
      },
    ],
  };
};

const TelevisionSinglePage = () => {
  const { id } = useParams(); // Would come from react-router
  const television = getTelevisionById(id || "1");

  const [quantity, setQuantity] = useState(1);
  const [singleProduct, setSingleProduct] = useState({})
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState("Display");

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Toggle specifications sections
  const toggleSpecSection = (category) => {
    if (expandedSpecs === category) {
      setExpandedSpecs("");
    } else {
      setExpandedSpecs(category);
    }
  };

  // Render star ratings
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };


  async function getSingleProductDetails(id) {
    try {
      const response = await axios.get(`${backend}/product/${id}`)
      if (response.data.status === "Success") {
        setSingleProduct(response.data.data.product)
      }
    } catch (error) {
      console.log("Error while getting single product details", error)
    }
  }

  useEffect(() => {
    getSingleProductDetails(id)
  }, [id])

  return (
    <div className="min-h-screen">
      <div>
        <div className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 text-2xl md:text-4xl">
          <nav className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link
              to="/televisions"
              className="text-gray-500 hover:text-gray-700"
            >
              Televisions
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-900 truncate max-w-xs">
              {singleProduct?.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
            {/* Product Images */}
            <div className="col-span-1 space-y-4">
              {/* Main Image */}
              <div className="border rounded-lg overflow-hidden h-64 sm:h-80 flex items-center justify-center bg-gray-100">
                <img
                  src={television.images[selectedImage]}
                  alt={television.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {television.images.map((img, index) => (
                  <div
                    key={index}
                    className={`border rounded cursor-pointer h-16 sm:h-20 flex items-center justify-center bg-gray-100 ${selectedImage === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : ""
                      }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${television.name} - view ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {singleProduct?.name}
                </h1>
                <p className="text-gray-500 mt-1">{television.company}™ TV</p>

                {/* Ratings */}
                <div className="mt-2 flex items-center space-x-2">
                  {renderStars(television.rating)}
                  <span className="text-sm text-gray-700">
                    {television.rating} ({television.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-2 border-t">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{singleProduct?.new_price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{singleProduct?.price}
                  </span>
                  <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                    {singleProduct?.discount_percentage}% off
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {singleProduct?.stock > 0 ? (
                  <>
                    <span className="flex items-center text-green-600">
                      <Check size={16} className="mr-1" />
                      In Stock
                    </span>
                    <span className="text-sm text-gray-500">Ready to ship</span>
                  </>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-medium text-gray-900">Highlights</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {singleProduct?.highlights?.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 border-t pt-4">
                {/* Quantity */}
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-700">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border-x p-1 text-gray-900"
                    />
                    <button
                      onClick={increaseQuantity}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-1 space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center">
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>

                </div>
              </div>

              {/* Services */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-1">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-gray-500">
                      Delivery within 3-5 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-1">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-medium">1 Year Warranty</p>
                    <p className="text-gray-500">
                      Standard manufacturer warranty
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-1">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-gray-500">7 days return policy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="text-blue-600 mt-1">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-gray-500">Multiple payment options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700">{singleProduct?.description}</p>
          </div>

          {/* Specifications */}
          <div className="border-t p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Specifications
            </h2>
            <div className="space-y-4">
              {television.specifications.map((spec) => (
                <div
                  key={spec.category}
                  className="border rounded-md overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
                    onClick={() => toggleSpecSection(spec.category)}
                  >
                    <span className="font-medium text-gray-900">
                      {spec.category}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition-transform ${expandedSpecs === spec.category
                        ? "transform rotate-180"
                        : ""
                        }`}
                    />
                  </button>

                  {expandedSpecs === spec.category && (
                    <div className="p-4 bg-white">
                      <table className="w-full">
                        <tbody>
                          {spec.details.map((detail, index) => (
                            <tr
                              key={index}
                              className={index !== 0 ? "border-t" : ""}
                            >
                              <td className="py-2 text-sm text-gray-500 pr-4">
                                {detail.name}
                              </td>
                              <td className="py-2 text-sm text-gray-900">
                                {detail.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Customer Reviews
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Write a Review
              </button>
            </div>

            {/* Review Summary */}
            <div className="flex items-start space-x-8 mb-8 pb-6 border-b">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {television.rating}
                </div>
                <div className="mt-1">{renderStars(television.rating)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Based on {television.reviewCount} reviews
                </div>
              </div>

              <div className="flex-1 max-w-md">
                {/* Rating bars - would be dynamically generated in a real app */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center text-sm">
                      <div className="w-8">{star} star</div>
                      <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width:
                              star === 5
                                ? "60%"
                                : star === 4
                                  ? "30%"
                                  : star === 3
                                    ? "7%"
                                    : star === 2
                                      ? "2%"
                                      : "1%",
                          }}
                        ></div>
                      </div>
                      <div className="w-8 text-right text-gray-500">
                        {star === 5
                          ? "60%"
                          : star === 4
                            ? "30%"
                            : star === 3
                              ? "7%"
                              : star === 2
                                ? "2%"
                                : "1%"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {television.reviews.map((review, index) => (
                <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                  <div className="flex justify-between">
                    <span className="font-medium">{review.name}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="mt-1">{renderStars(review.rating)}</div>
                  <h4 className="font-medium mt-2">{review.title}</h4>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))}

              {/* Show more button */}
              <div className="text-center pt-4">
                <button className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelevisionSinglePage;
