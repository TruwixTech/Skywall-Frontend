import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaTruck } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('pay-online');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zip: '',
    });
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { items, subtotal, shipping } = location.state || {};
    // const tax = subtotal * 0.08;
    const total = subtotal + shipping;

    const validateForm = () => {
        let isValid = true;
        toast.dismiss()

        // Name validation: Only letters and spaces
        if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
            toast.error("Name must contain only letters");
            isValid = false;
        }

        // Email validation
        if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
            toast.error("Enter a valid email address.");
            isValid = false;
        }

        // City validation: Only letters and spaces
        if (!/^[A-Za-z\s]+$/.test(formData.city.trim())) {
            toast.error("City must contain only letters and spaces.");
            isValid = false;
        }

        // ZIP Code validation: 6-digit number for India
        if (!/^\d{6}$/.test(formData.zip.trim())) {
            toast.error("ZIP code must be a 6-digit number.");
            isValid = false;
        }

        return isValid;
    };

    async function handleSubmit() {
        setLoading(true);
        try {
            if (!validateForm()) {
                setLoading(false)
                return
            }
            const response = await axios.post(`${backend}/payment/new`, { amount: total.toFixed(0) });
            const data = response.data.data.payment

            const paymentObject = new window.Razorpay({
                key: "rzp_test_m5TgogV8z5WjjW",
                order_id: data.id,
                ...data,
                handler: function (response) {
                    const option2 = {
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        amount: total.toFixed(0),
                        name: formData.name,
                        email: formData.email,
                        address: formData.address,
                        city: formData.city,
                        zip: formData.zip,
                        userId: items[0]?.user?._id,
                        items: cartItems,
                        shipping,
                    }
                    axios.post(`${backend}/payment/verify-payment`, option2)
                        .then(async (response) => {
                            if (response.status === 200) {
                                await axios.post(`${backend}/cart/${items[0]?._id}/remove`, {}, {
                                    headers: {
                                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                                    },
                                })
                                setLoading(true)
                                toast.success("Order Placed successfully")
                                navigate('/myorders')
                            } else {
                                console.log("error while placing order");
                            }
                        }).catch((error) => {
                            console.log(error);
                        })
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false)
                        toast.error("Payment Failed")
                    },
                },
            })
            paymentObject.open()
        } catch (error) {
            setLoading(false)
            console.log("error while order placement", error);
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

    useEffect(() => {
        // If user didn't come from the cart page, redirect to cart
        if (!location.state || location.state.from !== "cart") {
            navigate("/cart", { replace: true });
        }
        setCartItems(items[0]?.items);
        setFormData(
            {
                ...formData,
                name: items[0]?.user?.name,
                address: items[0]?.user?.address,
                email: items[0]?.user?.email,
            }
        )
    }, [location, navigate]);


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                {
                    loading && <LoadingSpinner />
                }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Shipping and Payment */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form className="space-y-6">
                            {/* Shipping Address */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaTruck className="h-6 w-6 text-blue-600 mr-2" />
                                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='Name'
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='Email'
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder='Address'
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='City'
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Country
                                        </label>
                                        <select disabled className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                            <option>India</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            ZIP Code
                                        </label>
                                        <input
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            value={formData.zip}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            placeholder='ZIP Code'
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaCreditCard className="h-6 w-6 text-blue-600 mr-2" />
                                    <h2 className="text-xl font-semibold">Payment Method</h2>
                                </div>

                                <div className="space-y-4">
                                    <div
                                        className={`p-4 border-2 rounded-md cursor-pointer transition-colors ${paymentMethod === 'pay-online'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => setPaymentMethod('pay-online')}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                checked={paymentMethod === 'pay-online'}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 font-medium">Pay Online</span>
                                        </div>
                                    </div>

                                    {/* COD Option (Disabled) */}
                                    <div className="p-4 border-2 rounded-md bg-gray-100 border-gray-300 cursor-not-allowed opacity-50">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                disabled
                                                className="h-4 w-4 text-gray-400"
                                            />
                                            <span className="ml-2 font-medium">Cash On Delivery (Unavailable)</span>
                                        </div>
                                        <p className="text-sm text-red-500 mt-1">COD is unavailable right now.</p>
                                    </div>

                                    {/* uncomment this when cod is avaliable */}
                                    {/* <div
                                        className={`p-4 border-2 rounded-md cursor-pointer transition-colors ${paymentMethod === 'cod'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment-method"
                                                checked={paymentMethod === 'cod'}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 font-medium">Cash On Delivery</span>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => {
                                const warrantyPrice = item.product.warranty_pricing[item.warranty_months] || 0;
                                return (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <div className='w-auto h-auto flex gap-2 items-center'>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                {
                                                    item.warranty_months
                                                        ? <p className="text-sm text-gray-500">Extended Warranty: {formatWarrantyPeriod(item.warranty_months)}</p>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className='w-auto h-auto flex flex-col'>
                                            <p className="font-medium">₹ {(item.product.new_price * item.quantity).toFixed(2)}</p>
                                            {
                                                item.warranty_months
                                                    ? <p className="text-sm text-gray-500">₹ {warrantyPrice}.00</p>
                                                    : null
                                            }
                                        </div>
                                    </div>)
                            })}
                        </div>

                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{shipping?.toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div> */}
                            <div className="flex justify-between font-semibold pt-2">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
                            onClick={handleSubmit}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;