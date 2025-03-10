import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FiTrash2 } from "react-icons/fi";
import { toast } from 'react-toastify';
 
const backend = import.meta.env.VITE_BACKEND;
 
function MyCart() {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [shippingCost] = useState(99); // Fixed shipping cost or calculate dynamically
    const navigate = useNavigate()
 
    // Add these calculation functions
    const calculateSubtotal = () => {
        return cartItems[0]?.items?.reduce((total, item) => {
            const warrantyPrice = item.product.warranty_pricing[item.warranty_months] || 0;
            return total + (item.product.new_price * item.quantity) + warrantyPrice;
        }, 0) || 0;
    };
 
    const token = JSON.parse(localStorage.getItem('token'))
 
    async function getCartItems() {
        try {
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
                setCartItems(response.data.data.cartList)
            }
 
        } catch (error) {
            console.log("Error while fetching cart items", error)
        }
    }
 
    async function handleCheckout() {
        toast.dismiss();
        toast.info("Proceeding to checkout...")
        navigate('/checkout', { state: { from: "cart", items: cartItems, subtotal: parseInt(calculateSubtotal().toFixed(2)), shipping: shippingCost } });
    }
 
    async function fetchAllProducts() {
        try {
            setLoading(true)
            const response = await axios.post(`${backend}/product/list`, {
                pageNum: 1,
                pageSize: 4,
                filters: {},
            });
 
            if (response.data.status === "Success") {
                setProducts(response.data.data.productList);
                setLoading(false)
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false)
        }
    }
 
    useEffect(() => {
        fetchAllProducts();
        getCartItems()
    }, []);
 
    async function removeFromCart(id) {
        try {
            setLoading(true)
            toast.dismiss()
            const response = await axios.post(`${backend}/cart/${cartItems[0]?._id}/remove-single-product`, {
                productId: id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.data.status === "Success") {
                getCartItems()
                toast.success("Product removed from cart successfully!")
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error while removing from cart", error)
        }
    }
 
    const formatWarrantyPeriod = (months) => {
        if (months < 12) return `${months} Month${months > 1 ? "s" : ""}`;
 
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return remainingMonths === 0
            ? `${years} Year${years > 1 ? "s" : ""}`
            : `${years}.${Math.round((remainingMonths / 12) * 10)} Years`;
    };
 
    return (
        <div className='w-full h-auto flex  flex-col '>
 
            <div className='lg:w-[70%] w-full  px-4  pt-8 min-h-screen mx-auto pb-10 md:pb-20'>
                {
                    loading
                        ? <div className="w-full h-80 flex justify-center items-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        : <>
                            {token
                                ? cartItems[0]?.items?.length > 0
                                    ? <div className="space-y-4 md:space-y-6">
                                        {cartItems[0]?.items?.map((item, index) => {
                                            const warrantyPrice = item.product.warranty_pricing[item.warranty_months] || 0;
                                            return (
                                                <div key={item._id} className="group relative flex flex-col md:flex-row gap-4 md:gap-6 px-4 py-5 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0 mx-auto md:mx-0">
                                                        <img
                                                            src={item.product.image[0]}
                                                            alt={item.product.name}
                                                            className="w-44 h-44 md:w-24 md:h-24 object-contain rounded-lg border border-gray-200"
                                                        />
                                                    </div>
                                                    {/* Product Details */}
                                                    <div className="flex-grow">
                                                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                                {item.product.name}
                                                            </h3>
                                                            <span className="text-sm text-gray-500 md:text-right md:pt-4">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {item.product.companyName}
                                                            </span>
                                                            <span className="text-xs text-gray-400 hidden md:inline">•</span>
                                                            <span className="text-sm text-gray-500 md:ml-2">
                                                                {item.product.category}
                                                            </span>
                                                        </div>
                                                        {/* Warranty Badge */}
                                                        <div className="mt-3 flex md:inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 bg-blue-50 rounded-full w-full md:w-auto">
                                                            <span className="text-sm font-medium text-blue-700 text-center md:text-left break-words">
                                                                {formatWarrantyPeriod(item.warranty_months + item.product.warranty_months)} Warranty
                                                            </span>
                                                            {
                                                                item.warranty_months > 0 && (
                                                                    <span className="text-xs text-blue-500 hidden md:inline">
                                                                        (+ ₹ {warrantyPrice?.toFixed(2)})
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                        {/* Price Breakdown */}
                                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-2 gap-2 text-sm md:text-base">
                                                            <div className="text-gray-500">Unit Price:</div>
                                                            <div className="text-right font-medium text-gray-700">
                                                                ₹{item.product.new_price?.toFixed(2)}
                                                            </div>
                                                            {
                                                                item.warranty_months > 0 && (
                                                                    <>
                                                                        <div className="text-gray-500">Warranty:</div>
                                                                        <div className="text-right font-medium text-gray-700">
                                                                            ₹{warrantyPrice?.toFixed(2)}
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                            {/* Mobile-only total */}
                                                            <div className="col-span-2 pt-2 border-t border-gray-100">
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>Total:</span>
                                                                    <span>
                                                                        ₹{(item.product.new_price * item.quantity + warrantyPrice)?.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => removeFromCart(item.product._id)}
                                                        className="absolute top-2 right-2 p-2 rounded-full text-gray-500 hover:text-red-600 cursor-pointer hover:bg-gray-100 transition"
                                                    >
                                                        <FiTrash2 className="w-5 h-5 text-red-500" />
                                                    </button>
                                                    {/* Vertical Separator */}
                                                    {index !== cartItems.length - 1 && (
                                                        <div className="absolute bottom-0 left-4 right-4 md:left-0 md:right-0 h-px bg-gray-100" />
                                                    )}
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                    : <div className="flex flex-col items-center justify-center text-center py-20">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                                            alt="Empty Cart"
                                            className="w-32 h-32 mb-6 opacity-70"
                                        />
                                        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">
                                            Your cart is empty
                                        </h1>
                                        <p className="text-gray-500 mt-2">
                                            Looks like you haven’t added anything to your cart yet.
                                        </p>
                                        <Link to="/televisions"
                                            className="mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                        >
                                            Start Shopping
                                        </Link>
                                    </div>
                                : <div className='flex flex-col items-center justify-center text-center '>
                                    <h1 className="w-full px-5 py-10 flex justify-center items-center  text-2xl md:text-4xl  h-52"> Your cart is empty</h1>
                                    <Link to="/televisions" className='bg-black text-white px-12 py-4 text-lg md:hover:bg-slate-900 duration-300 ease-in-out transition-all'>Continue Shopping</Link>
                                    <span className='text-2xl md:pt-16  py-2'>Have an account?</span>
                                    <p>  <Link to="/Signin" className='text-xl underline'>Log  in</Link><span className='text-xl text-gray-500'> to check out faster</span></p>
                                </div>
                            }
                            {token && cartItems[0]?.items?.length > 0 && (
                                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 sticky bottom-0 md:static">
                                    <div className="w-full ml-auto space-y-4">
                                        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">Order Summary</h2>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipping:</span>
                                                <span className="font-medium">
                                                    {`₹${shippingCost}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t pt-3">
                                                <span className="text-lg font-semibold text-gray-800">Total:</span>
                                                <span className="text-lg font-semibold text-green-600">
                                                    ₹{(calculateSubtotal() + shippingCost).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="pt-6 space-y-4">
                                            <button
                                                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                                                onClick={handleCheckout}
                                            >
                                                Proceed to Checkout
                                            </button>
                                            <div className="text-center text-sm text-gray-500">
                                                or <Link to="/televisions" className="text-green-600 hover:underline">Continue Shopping</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                }
                <h1 className='text-2xl md:text-3xl  py-12 text-gray-800 '>Featured collection</h1>
 
                {
                    loading
                        ? <div className="w-full h-80 flex justify-center items-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        : <div className="w-full h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 cursor-pointer ">
                            {products.map((television, index) => (
                                <Link to={`/television/${television._id}`}
                                    key={television._id}
                                    className="group w-full p-4 rounded-lg bg-white relative duration-300 ease-in-out transition-all overflow-hidden"
                                >
                                    {/* Sale Badge */}
                                    <span className="absolute z-20 top-2 left-2 bg-blue-600 text-white text-sm px-6 py-1 rounded-full">
                                        Sale
                                    </span>
 
                                    {/* TV Images (With Fade Transition) */}
                                    <div className="relative w-full h-60 rounded-md overflow-hidden">
                                        <img
                                            src={television?.image[0]}
                                            alt="image"
                                            className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0"
                                        />
                                        <img
                                            src={television?.image[1]}
                                            alt="hover image"
                                            className="absolute inset-0 w-full h-full object-contain rounded-md transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                                        />
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
                <div className='flex flex-col items-center justify-center text-center  mt-14 '>
                    <Link to="/televisions" className='bg-black text-white md:px-10 px-4 py-4 text-lg md:hover:bg-slate-900 duration-300 ease-in-out transition-all'>View ALL</Link>
                </div>
            </div>
        </div>
    )
}
 
export default MyCart