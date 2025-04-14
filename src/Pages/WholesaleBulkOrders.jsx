import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

function WholesaleBulkOrders() {
    const [wholesaleBulkProducts, setWholesaleBulkProducts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [checkoutForm, setCheckoutForm] = useState({
        // Contact Information
        email: '',
        contact: '',

        // Shipping Address
        firstName: '',
        lastName: '',
        fullAddress: '',
        apartment: '',
        city: '',
        country: 'India',
        state: '',
        zipCode: '',

        // Billing Address
        billingAddress: 'same', // 'same' or 'different'
        billingFirstName: '',
        billingLastName: '',
        billingFullAddress: '',
        billingApartment: '',
        billingCity: '',
        billingCountry: 'India',
        billingState: '',
        billingZipCode: '',

        // Company Information
        companyName: '',
        gstNumber: ''
    });

    async function fetchWholesaleBulkProducts() {
        try {
            setLoading(true);
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
                setLoading(false);
            }
        } catch (error) {
            console.log("Error while fetching wholesale bulk products", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchWholesaleBulkProducts();
    }, []);

    useEffect(() => {
        if (checkoutForm.billingAddress === 'same') {
            setCheckoutForm(prev => ({
                ...prev,
                billingFirstName: prev.firstName,
                billingLastName: prev.lastName,
                billingFullAddress: prev.fullAddress,
                billingApartment: prev.apartment,
                billingCity: prev.city,
                billingCountry: prev.country,
                billingState: prev.state,
                billingZipCode: prev.zipCode
            }));
        }
    }, [
        checkoutForm.billingAddress,
        checkoutForm.firstName,
        checkoutForm.lastName,
        checkoutForm.fullAddress,
        checkoutForm.apartment,
        checkoutForm.city,
        checkoutForm.country,
        checkoutForm.state,
        checkoutForm.zipCode
    ]);

    const handleQuantityChange = (index, value) => {
        const updatedProducts = [...wholesaleBulkProducts];

        // Allow empty input to let the user clear the field
        updatedProducts[index].quantity = value === "" ? "" : Math.max(1, Number(value));

        // Auto-select when quantity changes
        updatedProducts[index].selected = true;

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
        const { name, value, type, checked } = e.target;

        // For radio buttons
        if (type === 'radio') {
            setCheckoutForm(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setCheckoutForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const nameRegex = /^[A-Za-z\s]+$/;
        const contactRegex = /^[0-9]{10}$/;
        const zipRegex = /^[0-9]{6}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!emailRegex.test(checkoutForm.email)) {
            toast.error("Enter a valid email address");
            return false;
        }

        if (!contactRegex.test(checkoutForm.contact)) {
            toast.error("Contact must be exactly 10 digits");
            return false;
        }

        if (!nameRegex.test(checkoutForm.firstName) || !checkoutForm.firstName.trim()) {
            toast.error("First name must contain only letters");
            return false;
        }

        if (!nameRegex.test(checkoutForm.lastName) || !checkoutForm.lastName.trim()) {
            toast.error("Last name must contain only letters");
            return false;
        }

        if (!checkoutForm.fullAddress.trim()) {
            toast.error("Shipping address is required");
            return false;
        }

        if (!checkoutForm.city.trim()) {
            toast.error("City is required");
            return false;
        }

        if (!checkoutForm.country.trim()) {
            toast.error("Country is required");
            return false;
        }

        if (!checkoutForm.state.trim()) {
            toast.error("State is required");
            return false;
        }

        if (!zipRegex.test(checkoutForm.zipCode)) {
            toast.error("Zip code must be exactly 6 digits");
            return false;
        }

        if (checkoutForm.billingAddress === 'different') {
            if (!nameRegex.test(checkoutForm.billingFirstName) || !checkoutForm.billingFirstName.trim()) {
                toast.error("Billing first name must contain only letters");
                return false;
            }

            if (!nameRegex.test(checkoutForm.billingLastName) || !checkoutForm.billingLastName.trim()) {
                toast.error("Billing last name must contain only letters");
                return false;
            }

            if (!checkoutForm.billingFullAddress.trim()) {
                toast.error("Billing address is required");
                return false;
            }

            if (!checkoutForm.billingCity.trim()) {
                toast.error("Billing city is required");
                return false;
            }

            if (!checkoutForm.billingCountry.trim()) {
                toast.error("Billing country is required");
                return false;
            }

            if (!checkoutForm.billingState.trim()) {
                toast.error("Billing state is required");
                return false;
            }

            if (!zipRegex.test(checkoutForm.billingZipCode)) {
                toast.error("Billing zip code must be exactly 6 digits");
                return false;
            }
        }

        return true;
    };

    const handleCheckoutSubmit = async (e) => {
        try {
            toast.dismiss();
            e.preventDefault();
            if (!validateForm()) return
            if (selectedProducts.length === 0) {
                toast.error('Please select at least one product.');
                return
            }
            setLoading(true);
            const products = selectedProducts.map(product => ({
                product_id: product.product_id._id,
                quantity: product.quantity,
                price: calculatePrice(product).totalPrice.toFixed(0)
            }))
            const data = {
                products: products,
                total_price: totalSelectedValue.toFixed(0),
                email: checkoutForm.email,
                contact: checkoutForm.contact,
                shipping_address: {
                    firstName: checkoutForm.firstName,
                    lastName: checkoutForm.lastName,
                    fullAddress: checkoutForm.fullAddress,
                    apartment: checkoutForm.apartment,
                    city: checkoutForm.city,
                    country: checkoutForm.country,
                    state: checkoutForm.state,
                    zipCode: checkoutForm.zipCode
                },
                billing_address: {
                    billingFirstName: checkoutForm.billingFirstName,
                    billingLastName: checkoutForm.billingLastName,
                    billingFullAddress: checkoutForm.billingFullAddress,
                    billingApartment: checkoutForm.billingApartment,
                    billingCity: checkoutForm.billingCity,
                    billingCountry: checkoutForm.billingCountry,
                    billingState: checkoutForm.billingState,
                    billingZipCode: checkoutForm.billingZipCode
                },
                companyName: checkoutForm.companyName,
                gstNumber: checkoutForm.gstNumber,
            }

            const response = await axios.post(`${backend}/wholesale/orders/new`, data);

            if (response.data.status === "Success") {
                toast.success("Order Placed Successfully! Please check your email for order details");
                fetchWholesaleBulkProducts()
                setCheckoutForm({
                    // Contact Information
                    email: '',
                    contact: '',

                    // Shipping Address
                    firstName: '',
                    lastName: '',
                    fullAddress: '',
                    apartment: '',
                    city: '',
                    country: 'India',
                    state: '',
                    zipCode: '',

                    // Billing Address
                    billingAddress: 'same', // 'same' or 'different'
                    billingFirstName: '',
                    billingLastName: '',
                    billingFullAddress: '',
                    billingApartment: '',
                    billingCity: '',
                    billingCountry: 'India',
                    billingState: '',
                    billingZipCode: '',

                    // Company Information
                    companyName: '',
                    gstNumber: ''
                });
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log("Error while submitting checkout form", error);
        }
    };


    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {
                loading && <LoadingSpinner />
            }
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
                                                        step="1" // Prevents decimals when using up/down arrows
                                                        value={item.quantity === 0 ? "" : item.quantity}
                                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === '.' || e.key === 'e' || e.key === '+' || e.key === '-') {
                                                                e.preventDefault();
                                                            }
                                                        }}
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

                    <div className="mt-8 p-6 bg-white rounded-xl ">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Secure Checkout</h2>
                        <form onSubmit={handleCheckoutSubmit} className="space-y-8">
                            {/* Contact Information */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email*"
                                        value={checkoutForm.email}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="contact"
                                        placeholder="Contact Number*"
                                        value={checkoutForm.contact}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Shipping Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name*"
                                        value={checkoutForm.firstName}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name*"
                                        value={checkoutForm.lastName}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="fullAddress"
                                        placeholder="Street Address*"
                                        value={checkoutForm.fullAddress}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="apartment"
                                        placeholder="Apartment, Suite, etc. (optional)"
                                        value={checkoutForm.apartment}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City*"
                                        value={checkoutForm.city}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="country"
                                        disabled
                                        placeholder="Country*"
                                        value={checkoutForm.country}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State/Province*"
                                        value={checkoutForm.state}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="zipCode"
                                        placeholder="ZIP/Postal Code*"
                                        value={checkoutForm.zipCode}
                                        onChange={handleCheckoutFormChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Billing Address</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="billingAddress"
                                                value="same"
                                                checked={checkoutForm.billingAddress === 'same'}
                                                onChange={handleCheckoutFormChange}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-gray-700">Same as shipping address</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="billingAddress"
                                                value="different"
                                                checked={checkoutForm.billingAddress === 'different'}
                                                onChange={handleCheckoutFormChange}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-gray-700">Use a different address</span>
                                        </label>
                                    </div>

                                    {checkoutForm.billingAddress === 'different' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {/* Repeat all shipping address fields for billing */}
                                            <input
                                                type="text"
                                                name="billingFirstName"
                                                value={checkoutForm.billingFirstName}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="First Name*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingLastName"
                                                value={checkoutForm.billingLastName}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="Last Name*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingFullAddress"
                                                value={checkoutForm.billingFullAddress}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="Street Address*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingApartment"
                                                value={checkoutForm.billingApartment}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="Apartment, Suite, etc. (optional)"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 md:col-span-2"
                                            />
                                            <input
                                                type="text"
                                                name="billingCity"
                                                value={checkoutForm.billingCity}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="City*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingCountry"
                                                disabled
                                                value={checkoutForm.billingCountry}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="Country*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingState"
                                                value={checkoutForm.billingState}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="State/Province*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="billingZipCode"
                                                value={checkoutForm.billingZipCode}
                                                onChange={handleCheckoutFormChange}
                                                placeholder="ZIP/Postal Code*"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Company & GST Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={checkoutForm.companyName}
                                            onChange={handleCheckoutFormChange}
                                            placeholder="Company Name (optional)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="text"
                                            name="gstNumber"
                                            value={checkoutForm.gstNumber}
                                            onChange={handleCheckoutFormChange}
                                            placeholder="GST Number (optional)"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
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