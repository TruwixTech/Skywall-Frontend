import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const backend = import.meta.env.VITE_BACKEND;

function WholesaleBulkOrders() {
    const [wholesaleBulkProducts, setWholesaleBulkProducts] = useState([]);
    const [checkoutForm, setCheckoutForm] = useState({
        email: '',
        contact: '',
        firstName: '',
        lastName: '',
        fullAddress: '',
        city: '',
        country: '',
        state: '',
        zipCode: ''
    });

    async function fetchWholesaleBulkProducts() {
        try {
            const response = await axios.post(`${backend}/wholesale/list`, {
                pageNum: 1,
                pageSize: 20,
                filters: {}
            });

            if (response.data.status === "Success") {
                const productsWithQuantity = response.data.data.wholesaleProductsList.map(product => ({
                    ...product,
                    quantity: 1,
                    selected: false,
                    expanded: false // Add expanded state
                }));
                setWholesaleBulkProducts(productsWithQuantity);
            }
        } catch (error) {
            console.log("Error while fetching wholesale bulk products", error);
        }
    }

    useEffect(() => {
        fetchWholesaleBulkProducts();
    }, []);

    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...wholesaleBulkProducts];
        updatedProducts[index].quantity = Math.max(1, Number(value));
        updatedProducts[index].selected = true; // Auto-select when quantity changes
        setWholesaleBulkProducts(updatedProducts);
    };

    const handleCheckboxChange = (index) => {
        const updatedProducts = [...wholesaleBulkProducts];
        updatedProducts[index].selected = !updatedProducts[index].selected;
        setWholesaleBulkProducts(updatedProducts);
    };

    const toggleProductExpand = (index) => {
        const updatedProducts = [...wholesaleBulkProducts];
        updatedProducts[index].expanded = !updatedProducts[index].expanded;
        setWholesaleBulkProducts(updatedProducts);
    };

    const calculatePrice = (product) => {
        const basePrice = product.product_id.new_price;
        let discount = 0;
        let applicableBreak = null;

        for (const priceBreak of product.priceBreaks) {
            if (product.quantity >= priceBreak.minQuantity &&
                (!priceBreak.maxQuantity || product.quantity <= priceBreak.maxQuantity)) {
                discount = priceBreak.discount;
                applicableBreak = priceBreak;
            }
        }

        const unitPrice = basePrice - discount;
        const totalPrice = unitPrice * product.quantity;

        return { basePrice, unitPrice, totalPrice, applicableBreak };
    };

    const selectedProducts = wholesaleBulkProducts.filter(product => product.selected);
    const totalSelectedValue = selectedProducts.reduce((total, product) => {
        const { totalPrice } = calculatePrice(product);
        return total + totalPrice;
    }, 0);

    const handleCheckoutFormChange = (e) => {
        const { name, value } = e.target;
        setCheckoutForm({
            ...checkoutForm,
            [name]: value
        });
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to backend
        console.log('Checkout Form Data:', checkoutForm);
        // You can add your API call here to process the order
    };


    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
                    Wholesale/Bulk Orders
                </h1>

                <div className="bg-white rounded-xl shadow-2xl p-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">
                            Choose Products with Quantity
                        </h2>
                        <p className="text-gray-600 mt-2 text-lg">
                            Click on products to view details and pricing
                        </p>
                    </div>

                    <div className="space-y-4">
                        {wholesaleBulkProducts.map((item, index) => {
                            const { basePrice, unitPrice, totalPrice, applicableBreak } = calculatePrice(item);

                            return (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-200"
                                >
                                    {/* Collapsible Header */}
                                    <div
                                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                                        onClick={() => toggleProductExpand(index)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={item.selected}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckboxChange(index);
                                                }}
                                                className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <img
                                                src={item.product_id.image[0]}
                                                alt={item.product_id.name}
                                                className="w-16 h-16 object-contain bg-white p-2 rounded-lg shadow-sm"
                                            />
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {item.product_id.name}
                                            </h3>
                                        </div>
                                        {item.expanded ? (
                                            <FaChevronUp className="text-gray-600" />
                                        ) : (
                                            <FaChevronDown className="text-gray-600" />
                                        )}
                                    </div>

                                    {/* Collapsible Content */}
                                    {item.expanded && (
                                        <div className="p-6 bg-white border-t border-gray-100">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                {item.priceBreaks.map((breakItem, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${applicableBreak === breakItem
                                                                ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-md'
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <p className="text-sm font-medium text-gray-600">
                                                            {breakItem.maxQuantity
                                                                ? `${breakItem.minQuantity}-${breakItem.maxQuantity} pieces`
                                                                : `${breakItem.minQuantity}+ pieces`}
                                                        </p>
                                                        <p className="text-xl font-bold text-indigo-600 mt-1">
                                                            -₹{breakItem.discount}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-lg font-medium text-gray-700">Quantity:</span>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    />
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                                                    <div className="text-center sm:text-right">
                                                        {unitPrice < basePrice ? (
                                                            <>
                                                                <span className="text-gray-500 line-through mr-2 text-lg">
                                                                    ₹{basePrice.toFixed(2)}
                                                                </span>
                                                                <span className="text-2xl font-bold text-green-600">
                                                                    ₹{unitPrice.toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                ₹{basePrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                        <span className="block text-sm text-gray-500 mt-1">per unit</span>
                                                    </div>

                                                    <div className="text-center sm:text-right">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            ₹{totalPrice.toFixed(2)}
                                                        </span>
                                                        <span className="block text-sm text-gray-500 mt-1">total</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Section */}
                    {selectedProducts.length > 0 && (
                        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Selected Products Summary
                            </h3>
                            <div className="space-y-4">
                                {selectedProducts.map((product, index) => {
                                    const { totalPrice } = calculatePrice(product);
                                    return (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-lg font-medium text-gray-700">
                                                {product.product_id.name} (Qty: {product.quantity})
                                            </span>
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">
                                        Total Value:
                                    </span>
                                    <span className="text-2xl font-bold text-indigo-600">
                                        ₹{totalSelectedValue.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 p-6 bg-white rounded-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
                        <form onSubmit={handleCheckoutSubmit}>
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={checkoutForm.email}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="contact"
                                        placeholder="Contact Number"
                                        value={checkoutForm.contact}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Shipping Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={checkoutForm.firstName}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={checkoutForm.lastName}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="fullAddress"
                                        placeholder="Full Address"
                                        value={checkoutForm.fullAddress}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={checkoutForm.city}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Country"
                                        value={checkoutForm.country}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={checkoutForm.state}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        value={checkoutForm.zipCode}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    Place Order
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default WholesaleBulkOrders;