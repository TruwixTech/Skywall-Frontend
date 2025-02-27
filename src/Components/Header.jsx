import React, { useEffect, useRef, useState } from "react";
import Logo from "../assets/logo.png";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa6";


function Header() {
  const [dropdown, setDropDown] = useState(false);
  const [infoDropdown, setInfoDropdown] = useState(false); // State for "Information" 
  const [infoDropdown2, setInfoDropdown2] = useState(false); // State for "Information" 


  const location = useLocation()

  const dropdownRef = useRef(null);
  const infoDropdownRef = useRef(null);
  const infoDropdownRef2 = useRef(null);


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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full h-16 sm:h-20 md:h-24 flex px-5 items-center justify-between relative lg:px-10 xl:px-32 2xl:px-40">
        {/* Logo */}
        <NavLink to="/" className="w-auto h-9 md:h-12">
          <img src={Logo} alt="logo" className="w-full h-full" />
        </NavLink>

        <div className="w-auto h-auto gap-5 items-center hidden md:flex lg:gap-8 xl:gap-12">
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
              <div className="absolute top-10 left-0 w-64 bg-white border border-gray-200 shadow-lg p-7 py-3 flex flex-col gap-2 z-10">
                {[
                  { name: "Unboxing Policy", path: "/unboxing-policy" },
                  { name: "Disclaimer", path: "/disclaimer" },
                  { name: "Terms and Conditions", path: "/terms-conditions" },
                  { name: "Privacy Policy", path: "/privacy-policy" },
                  { name: "Shipping Policy", path: "/shipping-policy" },
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
          <IoIosSearch size={20} className="text-black cursor-pointer sm:size-6" />
          <NavLink to='/signin'><FaRegUser size={20} className="text-black cursor-pointer sm:size-6 md:hover:scale-110 duration-300 ease-in-out" /></NavLink>
          <TiShoppingCart size={25} className="hidden md:block text-black cursor-pointer" />

          {dropdown ? (
            <IoClose
              onClick={() => setDropDown(!dropdown)}
              size={25}
              className="text-black cursor-pointer sm:size-8 md:hidden"
            />
          ) : (
            <HiBars3
              onClick={() => setDropDown(!dropdown)}
              size={25}
              className="text-black cursor-pointer sm:size-8 md:hidden"
            />
          )}
        </div>
      </header>
      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute top-[64px] sm:top-20 border border-gray-200 right-2 z-20 w-60 bg-white shadow-xl py-3 flex flex-col gap-2 transition-all duration-300 transform md:hidden ${dropdown
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
            <div className="absolute top-10 right-0 w-64 bg-white border border-gray-200 shadow-lg p-7 py-3 flex flex-col gap-2 z-10">
              {[
                { name: "Unboxing Policy", path: "/unboxing-policy" },
                { name: "Disclaimer", path: "/disclaimer" },
                { name: "Terms and Conditions", path: "/terms-conditions" },
                { name: "Privacy Policy", path: "/privacy-policy" },
                { name: "Shipping Policy", path: "/shipping-policy" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {setInfoDropdown2(false);setDropDown(false);}} // Close on click
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
    </>
  );
}

export default Header;
