import React from "react";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../../utils/LoadingSpinner";

const backend = import.meta.env.VITE_BACKEND;

function Section1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manual Validation
  const validateForm = () => {
    const { name, email, phone, subject, message } = formData;

    // Name validation
    if (!name.trim()) {
      toast.error("Name is required.");
      return false;
    } else if (name.length < 3) {
      toast.error("Name must be at least 3 characters.");
      return false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      toast.error("Name can only contain letters.");
      return false;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    } else if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email.");
      return false;
    }

    // Phone validation (10-digit number)
    const phonePattern = /^[0-9]{10}$/;
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    } else if (!phonePattern.test(phone)) {
      toast.error("Phone number must be 10 digits.");
      return false;
    }

    // Subject validation
    if (!subject.trim()) {
      toast.error("Subject is required.");
      return false;
    } else if (subject.length < 3) {
      toast.error("Subject must be at least 3 characters.");
      return false;
    }

    // Message validation
    if (!message.trim()) {
      toast.error("Message is required.");
      return false;
    } else if (message.length < 10) {
      toast.error("Message must be at least 10 characters.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    // Validate form before submitting
    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(`${backend}/admin/contact-us`, formData);
      toast.success("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-auto flex  flex-col ">
      <div className="flex justify-center">
        <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 justify-center md:justify-start flex text-2xl md:text-4xl">
          Contact Us
        </h1>
      </div>
      {
        loading && <LoadingSpinner />
      }

      {/* form */}
      <div className="grid md:grid-cols-2 gap-8 px-5 md:px-10 lg:px-20 xl:px-32 py-10">
        {/* Left Section - Contact Details */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-xl text-[#373f43] mb-4">
              E-mail
            </h4>
            <p className="text-[#8c959f] flex gap-4 items-center">
              <span>
                <Mail size={20} />
              </span>
              customer.care@foxskyindia.com
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xl text-[#373f43] mb-4">
              Address
            </h4>
            <p className="max-w-90 text-[#8c959f] flex gap-4 items-center">
              <span>
                <MapPin size={25} />
              </span>{" "}
              49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar
              Pradesh, India 201010.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xl text-[#373f43] mb-4">
              Reach out to us at
            </h4>
            <p className="text-[#8c959f] flex gap-4 items-center">
              <span>
                <Phone size={20} />
              </span>{" "}
              +91-7079797902
            </p>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] outline-none"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] outline-none"
                placeholder="Your email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] outline-none"
                placeholder="Your Phone Number"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] outline-none"
                placeholder="Your subject"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full py-4 px-4 resize-none bg-gray-200 rounded-[25px] outline-none"
              placeholder="Write message"
              rows="5"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#01210f] p-3 px-10 rounded-2xl  text-white cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Section1;
