import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaTruck } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";

const backend = import.meta.env.VITE_BACKEND;

function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState('pay-online');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        country: '',
        zip: '',
    });
    const location = useLocation();
    const navigate = useNavigate();

    const cartItems = [
        { id: 1, name: 'Wireless Headphones', price: 149.99, quantity: 1 },
        { id: 2, name: 'Smartwatch', price: 199.99, quantity: 2 },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        // console.log('Form submitted:', formData);
    };

    useEffect(() => {
        // If user didn't come from the cart page, redirect to cart
        if (!location.state || location.state.from !== "cart") {
            navigate("/cart", { replace: true });
        }
    }, [location, navigate]);


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Shipping and Payment */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Shipping Address */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaTruck className="h-6 w-6 text-blue-600 mr-2" />
                                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='First Name'
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder='Last Name'
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
                                            type="text"
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

                                    <div
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
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
                            type="submit"
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