import React, { useState } from "react";
import { LuMailOpen } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";
import { LuPhoneCall } from "react-icons/lu";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import Logo from "../assets/logo.webp";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../utils/LoadingSpinner";


const backend = import.meta.env.VITE_BACKEND;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function userSubsribes() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${backend}/otp/user-subscribes`, {
        email: email
      });

      if (response.data.status === "Success") {
        toast.success('Subscribed successfully!');
        setEmail('');
      }
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }


  return (
    <footer className="w-full h-auto flex flex-col bg-gray-200">
      {
        loading && <LoadingSpinner />
      }
      <a
        href="https://wa.me/+919871723469"
        className="whatsapp-float"
        target="_blank"
      >
        <span className="p-2 rounded-full flex justify-center items-center bg-[#0ec043] md:hover:scale-110 duration-500 ease-in-out">
          <FaWhatsapp size={35} className="whatsapp-icon text-white" />
        </span>
      </a>

      <div className="w-full h-auto flex flex-col py-4 items-center gap-7 font-dmSans md:flex-row md:justify-between md:items-start md:px-10 md:my-7 lg:px-20">
        <div className="w-auto h-auto">
          <img src={Logo} alt="Logo" className="w-36 mx-auto" />
        </div>
        <div className="w-full h-auto flex flex-col justify-center items-center gap-3 md:w-80 xl:w-96">
          <div className="w-80 h-auto flex p-1 rounded-3xl overflow-hidden bg-white xl:w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe to Get Exclusive offers"
              className="outline-none text-black w-full py-1.5 px-4"
            />
            <span onClick={userSubsribes} className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-6 rounded-3xl cursor-pointer">
              Submit
            </span>
          </div>
        </div>
      </div>
      <hr />

      {/* Footer Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-10 gap-8 pt-5 pb-5">
        {/* Company Section */}
        <div>
          <h1 className="font-bold text-2xl xl:text-3xl">Quick Links</h1>
          <div className="mt-4 flex flex-col space-y-2 ">
            <span
              onClick={() => navigate("/")}
              className="w-fit cursor-pointer"
            >
              Home
            </span>
            <span
              onClick={() => navigate("/televisions")}
              className="w-fit cursor-pointer"
            >
              Televisions
            </span>
            <span
              onClick={() => navigate("/about")}
              className="w-fit cursor-pointer"
            >
              About Us
            </span>
            <span
              onClick={() => navigate("/news-media")}
              className="w-fit cursor-pointer"
            >
              News & Media
            </span>
            <span
              onClick={() => navigate("/contact")}
              className="w-fit cursor-pointer"
            >
              Contact
            </span>
          </div>
        </div>

        {/* Divisions Section */}
        <div>
          <h1 className="font-bold text-2xl xl:text-3xl">Information</h1>
          <div className="mt-4 flex flex-col space-y-2">
            <span
              onClick={() => navigate("/unboxing-policy")}
              className="w-fit cursor-pointer"
            >
              Unboxing Policy
            </span>
            <span
              onClick={() => navigate("/privacy-policy")}
              className="w-fit cursor-pointer"
            >
              Privacy Policy
            </span>
            <span
              onClick={() => navigate("/shipping-policy")}
              className="w-fit cursor-pointer"
            >
              Shipping Policy
            </span>
            <span
              onClick={() => navigate("/terms-conditions")}
              className="w-fit cursor-pointer"
            >
              Terms & Conditions
            </span>
            <span
              onClick={() => navigate("/disclaimer")}
              className="w-fit cursor-pointer"
            >
              Disclaimer
            </span>
          </div>
        </div>

        {/* Follow Us & Download PDF */}
        <div className="flex flex-col">
          {/* <h1 className="font-bold text-2xl xl:text-3xl">Follow Us</h1> */}
          <div className="mt-4 flex gap-3">
            <Link target="_blank" to='https://www.facebook.com/skywalltv.in' className="w-fit cursor-pointer p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex justify-center items-center">
              <FaFacebookF size={18} className="text-white" />
            </Link>
            <Link target="_blank" to='https://x.com/Skywall_tv' className="w-fit cursor-pointer p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex justify-center items-center">
              <FaXTwitter size={18} className="text-white" />
            </Link>
            <Link target="_blank" to='https://www.instagram.com/skywalltvofficial/' className="w-fit cursor-pointer p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex justify-center items-center">
              <FaInstagram size={18} className="text-white" />
            </Link>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-41 mt-5 py-2 cursor-pointer px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl"
          >
            Track Orders
          </button>
          <button
            onClick={() => navigate("/wholesale-bulk-products")}
            className="w-41 mt-5 py-2 cursor-pointer px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl"
          >
            Wholesale Orders
          </button>
        </div>

        {/* Office Address */}
        <div>
          <h1 className="font-bold text-2xl xl:text-3xl">Contact Us</h1>
          <div className="mt-4 flex flex-col space-y-3">
            <span className="flex gap-4 items-center lg:text-xs xl:text-base">
              <SlLocationPin size={20} className="flex-shrink-0" /> <p>49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar Pradesh, India 201010</p>
            </span>

            <span className="flex gap-4 items-center lg:text-xs xl:text-base">
              <LuMailOpen size={20} className="flex-shrink-0" />{" "}
              <a href="mailto:customer.care@foxskyindia.com">customer.care@foxskyindia.com</a>
            </span>
            <span className="flex gap-4 items-center lg:text-xs xl:text-base">
              <LuPhoneCall size={20} />{" "}
              <a href="tel:+917079797902">+91 7079797902</a>
            </span>
          </div>
        </div>
      </div>
      <hr />
      {/* Footer Bottom Section */}
      <div className="w-full px-10 pb-5">
        <div className="w-full flex flex-col gap-3 mt-5 text-sm text-center md:flex-row md:justify-between">
          <span className="font-semibold">
            Monday - Saturday: 09:30 am - 06:30 pm
          </span>
          <span className="font-semibold">
            © 2022 – 2025 | Skywall, developed by{" "}
            <a href="https://www.campaigningsource.com/">Campaigning Source</a>,
            all rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
