import React, { useState } from "react";
import Logo from "../assets/logo.png";
import { HiBars3 } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { NavLink } from "react-router-dom";


function Header() {
  const [dropdown, setDropDown] = useState(false);

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
            { name: "Information", path: "/information" },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `cursor-pointer transition-colors duration-300 ${isActive ? "text-black underline underline-offset-4" : "hover:text-black text-gray-500 hover:underline hover:underline-offset-4"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Icons */}
        <div className="w-auto h-auto flex gap-3 items-center relative sm:gap-5 xl:gap-8">
          <IoIosSearch size={20} className="text-black cursor-pointer sm:size-6" />
          <FaRegUser size={20} className="text-black cursor-pointer sm:size-6" />
          <TiShoppingCart size={25} className="hidden md:block text-black cursor-pointer" />

          {
            dropdown
              ? <IoClose
                onClick={() => setDropDown(!dropdown)}
                size={25}
                className="text-black cursor-pointer sm:size-8 md:hidden"
              />
              : <HiBars3
                onClick={() => setDropDown(!dropdown)}
                size={25}
                className="text-black cursor-pointer sm:size-8 md:hidden"
              />
          }
        </div>
      </header>
      {/* Dropdown Menu */}
      <div
        className={`absolute z-10 top-[65px] sm:top-20 right-2 w-44 bg-white border shadow-lg rounded-lg py-3 flex flex-col gap-2 transition-all duration-300 transform md:hidden ${dropdown
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
          { name: "Information", path: "/information" },
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
      </div>
    </>
  );
}

export default Header;
