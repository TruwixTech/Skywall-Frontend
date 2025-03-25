import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo.webp";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ShoppingCart, User, ShoppingBag } from 'lucide-react';
import { FaChevronDown } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useDebounce } from 'use-debounce';
import axios from "axios";

const backend = import.meta.env.VITE_BACKEND;

function BottomNavigation({ searchFunc }) {
  return (
    <div className='fixed bottom-0 left-0 right-0 w-full h-auto p-2 bg-white border-t border-gray-200 flex justify-around items-center z-50 sm:hidden'>

      <NavLink
        to='/'
        className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <Home size={24} />
        <span className='text-xs mt-1'>Home</span>
      </NavLink>

      <button onClick={searchFunc} className='flex flex-col items-center text-gray-600 hover:text-gray-900 transition-colors'>
        <Search size={24} />
        <span className='text-xs mt-1'>Search</span>
      </button>

      <NavLink
        to='/televisions'
        className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <ShoppingBag size={24} />
        <span className='text-xs mt-1'>Shop</span>
      </NavLink>

      <NavLink
        to='/cart'
        className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <ShoppingCart size={24} />
        <span className='text-xs mt-1'>Cart</span>
      </NavLink>

      <NavLink
        to='/signin'
        className={({ isActive }) => `flex flex-col items-center transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        <User size={24} />
        <span className='text-xs mt-1'>Login</span>
      </NavLink>

    </div>
  );
}

function Header() {
  const [dropdown, setDropDown] = useState(false);
  const [infoDropdown, setInfoDropdown] = useState(false); // State for "Information" 
  const [infoDropdown2, setInfoDropdown2] = useState(false); // State for "Information" 
  const [user, setUser] = useState({})
  const [logoutPopup, setLogoutPopup] = useState(false)
  const [userDropDown, setUserDropDown] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate()
  const location = useLocation()

  const dropdownRef = useRef(null);
  const infoDropdownRef = useRef(null);
  const infoDropdownRef2 = useRef(null);
  const userDropdownRef = useRef(null)
  const token = localStorage.getItem("token")

  // Add search API call
  const fetchSearchResults = async (query) => {
    try {
      setSearchLoading(true);
      const response = await axios.post(`${backend}/product/list`, {
        pageNum: 1,
        pageSize: 10,
        filters: {
          name: { $regex: query, $options: 'i' }
        }
      });

      if (response.data.status === "Success") {
        setSearchResults(response.data.data.productList);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching products");
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search query changes
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      fetchSearchResults(debouncedQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token)
      setUser(decoded)
    }
  }, [token])

  function handleLogout() {
    localStorage.removeItem("token")
    window.location.reload()
    navigate('/')
    setLogoutPopup(false)
  }

  const handleClickOutside = (event) => {
    if (event.target.id === "logout-modal") {
      setLogoutPopup(false)
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
      if (infoDropdownRef.current && !infoDropdownRef.current.contains(event.target)) {
        setInfoDropdown(false);
      }
      if (infoDropdownRef2.current && !infoDropdownRef2.current.contains(event.target)) {
        setInfoDropdown2(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropDown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    }

    function handleScroll() {
      setDropDown(false);
      setInfoDropdown(false);
      setInfoDropdown2(false);
      setUserDropDown(false);
      setIsSearchOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="w-full h-16 sm:h-20 md:h-24 flex px-5 items-center justify-between relative lg:px-10 xl:px-32 2xl:px-40">
        {/* Logo */}
        <NavLink to="/" className="w-auto h-9 md:h-12">
          <img src={Logo} alt="logo" className="w-full h-full" />
        </NavLink>

        {/* Bottom Navigation Bar */}
        <BottomNavigation searchFunc={() => setIsSearchOpen(!isSearchOpen)} />

        <div className="w-auto h-auto gap-5 items-center hidden lg:flex lg:gap-8 xl:gap-12">
          {[
            { name: "Home", path: "/" },
            { name: "Televisions", path: "/televisions" },
            { name: "News & Media", path: "/news-media" },
            { name: "About Us", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `cursor-pointer transition-colors duration-300 ${isActive
                  ? "text-black underline underline-offset-4"
                  : "hover:text-black text-gray-500 hover:underline hover:underline-offset-4"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="relative" ref={infoDropdownRef}>
            <button
              onClick={() => setInfoDropdown(!infoDropdown)}
              className={`${location.pathname === '/unboxing-policy' || location.pathname === '/disclaimer' || location.pathname === '/terms-conditions' || location.pathname === '/privacy-policy' || location.pathname === '/shipping-policy' ? 'underline underline-offset-4' : ''} cursor-pointer transition-colors duration-300 text-gray-500 hover:text-black hover:underline hover:underline-offset-4 flex items-center gap-2`}
            // className="cursor-pointer transition-colors duration-300 text-gray-500 hover:text-black hover:underline hover:underline-offset-4 flex items-center gap-2"
            >
              INFORMATION <span>{infoDropdown ? <FaChevronDown size={15} className="rotate-180" /> : <FaChevronDown size={15} />}</span>
            </button>

            {/* Dropdown Menu */}
            {infoDropdown && (
              <div className="absolute top-10 left-0 w-64 bg-white border border-gray-200 shadow-lg p-7 py-3 flex flex-col gap-2 z-30">
                {[
                  { name: "Unboxing Policy", path: "/unboxing-policy" },
                  { name: "Disclaimer", path: "/disclaimer" },
                  { name: "Terms and Conditions", path: "/terms-conditions" },
                  { name: "Privacy Policy", path: "/privacy-policy" },
                  { name: "Shipping Policy", path: "/shipping-policy" },
                  { name: "Wholesale Bulk Orders", path: "/wholesale-bulk-products" },
                ].map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setInfoDropdown(false)} // Close on click
                    className={({ isActive }) =>
                      `cursor-pointer px-4 py-2 transition-colors duration-300 ${isActive
                        ? "text-black underline underline-offset-4"
                        : "hover:text-black text-gray-500 hover:underline hover:underline-offset-4"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Icons */}
        <div className="w-auto h-auto flex gap-3 items-center relative sm:gap-5 xl:gap-8">
          <div className="relative" ref={searchRef}>
            {/* Search Icon */}
            <IoIosSearch
              size={20}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-black cursor-pointer sm:size-6 hover:scale-110 transition-transform"
            />

            {/* Animated Search Bar */}
            <div className={`
    fixed top-0 left-0 right-0 bg-white shadow-md z-40 
    transform transition-all duration-300 ease-out
    ${isSearchOpen ? 'translate-y-16 md:translate-y-[85px] opacity-100' : '-translate-y-full opacity-0'}
  `}>
              <div className="container mx-auto px-4 py-3 flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && !searchLoading && (
                <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="container mx-auto px-4">
                    {searchResults.map((product) => (
                      <NavLink
                        key={product._id}
                        to={`/television/${product._id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="block px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">{product.name}</span>
                          <span className="text-sm text-gray-500">
                            ₹{product.price?.toFixed(2)}
                          </span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading Indicator */}
            {searchLoading && (
              <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          {
            user && user.userId
              ? (
                <div className="relative" ref={userDropdownRef}>
                  <FaRegUser size={20} onClick={() => setUserDropDown(!userDropDown)} className="text-black cursor-pointer sm:size-6 md:hover:scale-110 duration-300 ease-in-out" />
                  {userDropDown && (
                    <div className="absolute top-10 -left-[120px] xl:-left-20 w-52 bg-white border border-gray-200 shadow-lg p-7 py-3 flex flex-col gap-2 z-10">
                      {
                        user.role === 'admin' && (
                          <NavLink to='/' className="cursor-pointer px-4 py-2 transition-colors duration-300 text-center hover:text-black text-gray-500 hover:underline hover:underline-offset-4">Profile</NavLink>
                        )
                      }
                      {
                        user.role === 'User' && (
                          <>
                            <NavLink onClick={() => setUserDropDown(!userDropDown)} to='/user-profile' className="cursor-pointer px-4 py-2 transition-colors duration-300 text-center hover:text-black text-gray-500 hover:underline hover:underline-offset-4">Profile</NavLink>
                            <NavLink onClick={() => setUserDropDown(!userDropDown)} to='/myorders' className="cursor-pointer px-4 py-2 transition-colors duration-300 text-center hover:text-black text-gray-500 hover:underline hover:underline-offset-4">My Orders</NavLink>
                            <NavLink onClick={() => setUserDropDown(!userDropDown)} to='/my-invoices' className="cursor-pointer px-4 py-2 transition-colors duration-300 text-center hover:text-black text-gray-500 hover:underline hover:underline-offset-4">My Invoices</NavLink>
                            <NavLink onClick={() => setUserDropDown(!userDropDown)} to='/raise-complaint' className="cursor-pointer px-4 py-2 transition-colors duration-300 text-center hover:text-black text-gray-500 hover:underline hover:underline-offset-4">Raise Complaint</NavLink>
                          </>
                        )
                      }
                      <button onClick={() => setLogoutPopup(true)} className="cursor-pointer px-4 py-2 transition-colors duration-300 hover:text-black text-gray-500 hover:underline hover:underline-offset-4">Logout</button>
                    </div>
                  )}
                </div>
              )
              : <NavLink to='/signin'><FaRegUser size={20} className="text-black cursor-pointer sm:size-6 md:hover:scale-110 duration-300 ease-in-out" /></NavLink>
          }
          <NavLink to='/cart'><TiShoppingCart size={25} className="text-black cursor-pointer" /></NavLink>

          {dropdown ? (
            <IoClose
              onClick={() => setDropDown(!dropdown)}
              size={25}
              className="text-black cursor-pointer sm:size-8 lg:hidden"
            />
          ) : (
            <HiBars3
              onClick={() => setDropDown(!dropdown)}
              size={25}
              className="text-black cursor-pointer sm:size-8 lg:hidden"
            />
          )}
        </div>
      </header>
      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute top-[64px] sm:top-20 border border-gray-200 right-2 z-20 w-60 bg-white shadow-xl py-3 flex flex-col gap-2 transition-all duration-300 transform lg:hidden ${dropdown
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
      >
        {[
          { name: "Home", path: "/" },
          { name: "Televisions", path: "/televisions" },
          { name: "News & Media", path: "/news-media" },
          { name: "About Us", path: "/about" },
          { name: "Contact", path: "/contact" },
        ].map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setDropDown(false)} // Close dropdown when clicking a link
            className={({ isActive }) =>
              `cursor-pointer text-center px-4 py-2 transition-colors rounded ${isActive
                ? "text-black underline underline-offset-4"
                : "text-gray-500 hover:text-black hover:underline hover:underline-offset-4"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
        <div className="relative flex items-center justify-center" ref={infoDropdownRef2}>
          <button
            onClick={() => setInfoDropdown2(!infoDropdown2)}
            className={`${location.pathname === '/unboxing-policy' || location.pathname === '/disclaimer' || location.pathname === '/terms-conditions' || location.pathname === '/privacy-policy' || location.pathname === '/shipping-policy' ? 'underline underline-offset-4' : ''} cursor-pointer transition-colors duration-300 text-gray-500 hover:text-black hover:underline hover:underline-offset-4 flex items-center gap-2`}
          // className="cursor-pointer transition-colors duration-300 text-gray-500 hover:text-black hover:underline hover:underline-offset-4 flex items-center gap-2"
          >
            INFORMATION <span>{infoDropdown2 ? <FaChevronDown size={15} className="rotate-180" /> : <FaChevronDown size={15} />}</span>
          </button>

          {/* Dropdown Menu */}
          {infoDropdown2 && (
            <div className="absolute top-10 right-0 w-64 bg-white border border-gray-200 shadow-lg p-7 py-3 flex flex-col gap-2 z-30">
              {[
                { name: "Unboxing Policy", path: "/unboxing-policy" },
                { name: "Disclaimer", path: "/disclaimer" },
                { name: "Terms and Conditions", path: "/terms-conditions" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Shipping Policy", path: "/shipping-policy" },
                { name: "Wholesale Bulk Orders", path: "/wholesale-bulk-products" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => { setInfoDropdown2(false); setDropDown(false); }} // Close on click
                  className={({ isActive }) =>
                    `cursor-pointer px-4 py-2 transition-colors duration-300 ${isActive
                      ? "text-black underline underline-offset-4"
                      : "hover:text-black text-gray-500 hover:underline hover:underline-offset-4"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logout Popup */}
      {
        logoutPopup && (
          <div
            id="logout-modal"
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClickOutside}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center relative">
              <h2 className="text-xl font-bold text-gray-900">Are you sure?</h2>
              <p className="text-gray-600 mt-2">Do you want to logout?</p>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setLogoutPopup(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default Header;
