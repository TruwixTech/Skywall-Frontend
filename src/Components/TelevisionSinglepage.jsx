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
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { convertUTCtoIST2 } from "../utils/TimeConverter";


const backend = import.meta.env.VITE_BACKEND;


const TelevisionSinglePage = () => {
  const { id } = useParams(); // Would come from react-router
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1);
  const [singleProduct, setSingleProduct] = useState({})
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState("");
  const [images, setImages] = useState([])
  const [showWarrantyPopup, setShowWarrantyPopup] = useState(false)
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [productReviews, setProductReviews] = useState([])
  const [ratingDistribution, setRatingDistribution] = useState({})
  const [averageRating, setAverageRating] = useState(0);
  const [ratingPage, setRatingPage] = useState(1);
  const [alreadyInCart, setAlreadyInCart] = useState(false)
  const navigate = useNavigate()

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    toast.dismiss()
    if (quantity === singleProduct?.stock) {
      toast.error("Product is out of stock.");
      return
    }
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

  const calculateRatingDistribution = (reviews) => {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRatingSum = 0;

    // Count occurrences of each rating
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating]++;
        totalRatingSum += review.rating;
      }
    });

    const totalReviews = reviews.length;
    const ratingPercentages = {};

    // Convert counts to percentages
    Object.keys(ratingCounts).forEach((key) => {
      ratingPercentages[key] = totalReviews > 0 ? (ratingCounts[key] / totalReviews) * 100 : 0;
    });

    const avgRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

    setAverageRating(avgRating)

    return ratingPercentages;
  };

  async function getCartItems(token) {
    try {
      setLoading(true)
      const decodedToken = jwtDecode(token)
      const response = await axios.post(`${backend}/cart/list`, {
        filters: {
          user: decodedToken?.userId
        },
        pageNum: 1,
        pageSize: 50
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.status === "Success") {
        const isProductInCart = response.data.data.cartList[0].items.some(item => item.product._id === id)
        setAlreadyInCart(isProductInCart)
        // setCartItems(response.data.data.cartList)
        setLoading(false)
      }

    } catch (error) {
      console.log("Error while fetching cart items", error)
      setLoading(false)
    }
  }



  async function addToCart() {
    toast.dismiss()
    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) {
      toast.error("Please login to add product")
      navigate('/signin')
      return
    }
    const decodedToken = jwtDecode(token)
    try {
      const response = await axios.post(`${backend}/cart/new`, {
        cart: {
          user: decodedToken?.userId,
          items: [
            {
              product: singleProduct?._id,
              quantity: quantity,
              warranty_months: selectedWarranty
            }
          ]
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.data.status === "Success") {
        toast.success("Product added to cart successfully!")
        setShowWarrantyPopup(false)
        setSelectedWarranty(null)
        setAlreadyInCart(true)
        setQuantity(1)
      }
    } catch (error) {
      console.log("Error while adding product to cart", error)
    }
  }


  async function fetchSingleProductReviews(id) {
    try {
      const response = await axios.post(`${backend}/review/list`, {
        pageNum: ratingPage,
        pageSize: 20,
        filters: {
          product: id
        }
      })
      if (response.data.status === "Success") {
        setProductReviews(response.data.data.reviewList)
        const ratingPercentages = calculateRatingDistribution(response.data.data.reviewList);
        setRatingDistribution(ratingPercentages)
      }
    } catch (error) {
      console.log("Error while fetching single product reviews", error)
    }
  }

  async function submitReview(e) {
    try {
      e.preventDefault()
      const token = JSON.parse(localStorage.getItem('token'))
      if (!token) {
        toast.error("Please login to submit review")
        navigate('/signin')
        return
      }
      const decodedToken = jwtDecode(token)
      const response = await axios.post(`${backend}/review/new`, {
        review: {
          user: decodedToken?.userId,
          product: singleProduct?._id,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.data.status === "Success") {
        setShowReviewForm(false)
        toast.success("Review submitted successfully!")
        setNewReview({
          rating: 0,
          title: '',
          comment: ''
        })
        setHoveredRating(0)
        getSingleProductDetails(id)
      }
    } catch (error) {
      console.log("Error while submitting review", error)
    }
  }

  async function getSingleProductDetails(id) {
    try {
      setLoading(true)
      const response = await axios.get(`${backend}/product/${id}`)
      if (response.data.status === "Success") {
        setExpandedSpecs(response.data.data.product?.specificationSchema[0]?.title)
        setSingleProduct(response.data.data.product)
        setImages(response.data.data.product?.image)
        setLoading(false)
        fetchSingleProductReviews(response.data.data.product._id)
      }
    } catch (error) {
      setLoading(false)
      console.log("Error while getting single product details", error)
    }
  }

  useEffect(() => {
    getSingleProductDetails(id)
  }, [id, ratingPage])

  const formatWarrantyPeriod = (months) => {
    if (months < 12) return `${months} month${months > 1 ? "s" : ""}`;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths === 0
      ? `${years} year${years > 1 ? "s" : ""}`
      : `${years}.${Math.round((remainingMonths / 12) * 10)} years`;
  };

  function addToCartBtn() {
    toast.dismiss()
    singleProduct?.stock > 0
      ? alreadyInCart
        ? navigate('/cart')
        : handlepopup()
      : toast.error("Product is out of stock.");
  }


  function handlepopup() {
    if (
      singleProduct?.warranty_pricing &&
      Object.keys(singleProduct.warranty_pricing).length === 1 &&
      singleProduct.warranty_pricing[""] === 0
    ) {
      addToCart();
    } else {
      setShowWarrantyPopup(true);
    }
  }


  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      getCartItems(token)
    }
  }, [])

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
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:p-6">
            {/* Product Images */}
            <div className="col-span-1 space-y-4">
              {/* Main Image */}
              <div className="border rounded-lg overflow-hidden h-64 sm:h-80 flex items-center justify-center bg-gray-100">
                {loading ? (
                  <div className="w-full h-full bg-gray-300 animate-pulse" />
                ) : (
                  <img
                    src={images[selectedImage]}
                    alt='television Image'
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`border rounded cursor-pointer h-16 sm:h-20 flex items-center justify-center bg-gray-100 ${selectedImage === index ? "border-blue-500 ring-2 ring-blue-200" : ""}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      {loading ? (
                        <div className="w-full h-full bg-gray-300 animate-pulse" />
                      ) : (
                        <img src={img} alt='television Images' className="w-full h-full object-cover p-1" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div>
                {loading ? (
                  <div className="h-6 w-48 bg-gray-300 animate-pulse rounded" />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{singleProduct?.name}</h1>
                )}
                {loading ? (
                  <div className="h-4 w-32 bg-gray-300 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-gray-500 mt-1">{singleProduct?.companyName}™ TV</p>
                )}

                {/* Ratings */}
                <div className="mt-2 flex items-center space-x-2">
                  {loading ? (
                    <div className="h-5 w-24 bg-gray-300 animate-pulse rounded" />
                  ) : (
                    <>
                      {renderStars(averageRating)}
                      <span className="text-sm text-gray-700">
                        {averageRating} ({productReviews.length} reviews)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="pt-2 border-t">
                <div className="flex items-baseline space-x-2">
                  {loading ? (
                    <div className="h-8 w-32 bg-gray-300 animate-pulse rounded" />
                  ) : (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">₹{singleProduct?.new_price}</span>
                      <span className="text-lg text-gray-500 line-through">₹{singleProduct?.price}</span>
                      <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">{singleProduct?.discount_percentage}% off</span>
                    </div>
                  )}
                </div>
                {loading ? (
                  <div className="h-4 w-48 bg-gray-300 animate-pulse rounded mt-1" />
                ) : (
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="h-5 w-24 bg-gray-300 animate-pulse rounded" />
                ) : (
                  singleProduct?.stock > 0 ? (
                    <>
                      <span className="flex items-center text-green-600">
                        <Check size={16} className="mr-1" />
                        In Stock
                      </span>
                      <span className="text-sm text-gray-500">Ready to ship</span>
                    </>
                  ) : (
                    <span className="text-red-600">Out of Stock</span>
                  )
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-2 border-t pt-4">
                <h3 className="font-medium text-gray-900">Highlights</h3>
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-1/3 bg-gray-300 animate-pulse rounded" />
                    <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded" />
                    <div className="h-4 w-1/3 bg-gray-300 animate-pulse rounded" />
                  </div>
                ) : (
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {singleProduct?.highlights?.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
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
                  {loading ? (
                    <div className="h-12 w-full bg-gray-300 animate-pulse rounded" />
                  ) : (
                    <button onClick={addToCartBtn}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center">
                      <ShoppingCart size={18} className="mr-2" />
                      {
                        alreadyInCart
                          ? "Already in Cart"
                          : "Add to Cart"
                      }
                    </button>
                  )}
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
                    <p className="font-medium">
                      {singleProduct?.warranty_months >= 12
                        ? `${(singleProduct?.warranty_months / 12).toFixed(0)} Years`
                        : `${singleProduct?.warranty_months} months`}
                      {" "}Warranty
                    </p>
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
              {singleProduct?.specificationSchema?.map((spec) => (
                <div
                  key={spec.title}
                  className="border rounded-md overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
                    onClick={() => toggleSpecSection(spec.title)}
                  >
                    <span className="font-medium text-gray-900">
                      {spec.title}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition-transform ${expandedSpecs === spec.title
                        ? "transform rotate-180"
                        : ""
                        }`}
                    />
                  </button>

                  {expandedSpecs === spec.title && (
                    <div className="p-4 bg-white">
                      <table className="w-full">
                        <tbody>
                          {spec?.data?.map((detail, index) => (
                            <tr
                              key={index}
                              className={index !== 0 ? "border-t" : ""}
                            >
                              <td className="py-2 text-sm text-gray-500 pr-4">
                                {detail.key}
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
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <form onSubmit={submitReview} >
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Your Rating
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1"
                          >
                            <svg
                              className={`w-8 h-8 ${star <= (hoveredRating || newReview.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Review Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Review Title"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newReview.title}
                        onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      />
                    </div>

                    {/* Review Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Review
                      </label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Write your review here..."
                        className="w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Review Summary */}
            <div className="flex flex-col items-center md:flex-row md:items-start space-x-8 mb-8 pb-6 border-b">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {averageRating}
                </div>
                <div className="mt-1">{renderStars(averageRating)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Based on {productReviews.length} reviews
                </div>
              </div>

              <div className="flex-1 md:w-auto w-full max-w-md">
                {/* Rating bars - would be dynamically generated in a real app */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center text-sm">
                      <div className="w-8">{star} star</div>
                      <div className="flex-1 mx-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${ratingDistribution[star] || 0}%`,
                          }}
                        ></div>
                      </div>
                      <div className="w-8 text-right text-gray-500">
                        {ratingDistribution[star]?.toFixed(1) || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {
                productReviews.length > 0
                  ? productReviews.map((review, index) => (
                    <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                      <div className="flex justify-between">
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-gray-500">{convertUTCtoIST2(review.createdAt)}</span>
                      </div>
                      <div className="mt-1">{renderStars(review.rating)}</div>
                      <h4 className="font-medium mt-2">{review.title}</h4>
                      <p className="text-gray-700 mt-1">{review.comment}</p>
                    </div>
                  ))
                  : <div className="w-full h-20 flex justify-center items-center">
                    <span className="font-semibold text-lg lg:text-xl">No reviews found</span>
                  </div>
              }

              {/* Show more button */}
              {
                productReviews.length > 20 && (
                  <div className="text-center pt-4">
                    <button onClick={() => setRatingPage(ratingPage + 1)} className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Load More Reviews
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      {
        showWarrantyPopup && singleProduct?.warranty_pricing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-96 transform transition-all duration-300 animate-scale-in max-h-screen overflow-y-scroll" style={{
              scrollbarWidth: "none",
            }}>
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Extend Your Protection</h2>
                  <p className="text-gray-500 mt-1">Secure your investment with extended coverage</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {Object.entries(singleProduct?.warranty_pricing).map(([months, price]) => (
                  <label key={months} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-all cursor-pointer has-[:checked]:border-green-500 has-[:checked]:bg-green-50">
                    <input type="radio" name="warranty" className="form-radio h-5 w-5 text-green-500" checked={selectedWarranty === months} onChange={() => setSelectedWarranty(months)} />
                    <div className="ml-4">
                      <span className="block font-semibold text-gray-800">
                        {formatWarrantyPeriod(parseInt(months))}
                      </span>
                      <span className="block text-gray-500"> ₹{price}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => {
                    setShowWarrantyPopup(false),
                      setSelectedWarranty(null),
                      setQuantity(1)
                  }}
                  className="flex-1 px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
                >
                  No Thanks
                </button>
                <button
                  onClick={addToCart}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  Add Protection
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-4">
                30-day money back guarantee
              </p>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default TelevisionSinglePage;
