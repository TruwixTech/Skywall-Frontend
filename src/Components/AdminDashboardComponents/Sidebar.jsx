import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => setIsOpen(!isOpen);
    const closeNav = () => setIsOpen(false);

    return (
        <>
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 transform ${isOpen ? "translate-x-0" : "-translate-x-64"} transition-transform duration-300 ease-in-out z-50`}>
                {/* Close Button */}
                <button onClick={toggleNav} className="absolute top-4 right-4 text-white text-2xl">
                    <FaTimes />
                </button>

                {/* Navigation Links */}
                <nav className="mt-10 space-y-4">
                <Link to="/admin-dashboard" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Dashboard</Link>
                    <Link to="/admin-dashboard/statistics" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Statistics</Link>
                    <Link to="/admin-dashboard/addproduct" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Add Product</Link>
                    <Link to="/admin-dashboard/allproduct" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">All Products</Link>
                    <Link to="/admin-dashboard/orders" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Orders</Link>
                    <Link to="/admin-dashboard/coupon" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Discount Coupon</Link>
                    {/* <Link to="/admin-dashboard/inventory" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">Inventory Management</Link> */}
                    <Link to="/admin-dashboard/complaints" onClick={closeNav} className="block p-3 hover:bg-gray-700 rounded">All Complaint Raised</Link>
                </nav>
            </div>

            {/* Toggle Button */}
            <button 
                className="fixed top-16 sm:top-20 md:top-24 left-2 z-40 text-3xl bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-400 transition duration-200"
                onClick={toggleNav}
            >
                <FaBars />
            </button>
        </>
    );
};

export default Sidebar;
