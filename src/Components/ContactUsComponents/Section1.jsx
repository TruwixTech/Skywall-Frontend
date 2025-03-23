import React, { useState, useCallback, memo } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "../../utils/LoadingSpinner";

const backend = import.meta.env.VITE_BACKEND;

// Memoized contact detail items to prevent unnecessary re-renders
const ContactDetail = memo(({ icon: Icon, title, content }) => (
  <div>
    <h4 className="font-semibold text-xl text-[#373f43] mb-4">{title}</h4>
    <p className="text-[#8c959f] flex gap-4 items-center">
      <span><Icon size={20} /></span>
      {content}
    </p>
  </div>
));

function Section1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Memoized handleChange using useCallback
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

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
    <div className="w-full h-auto flex flex-col">
      <div className="flex justify-center">
        <h1 className="w-full px-5 md:px-10 lg:px-20 xl:px-32 py-10 bg-gray-200 justify-center md:justify-start flex text-2xl md:text-4xl">
          Contact Us
        </h1>
      </div>
      {loading && <LoadingSpinner />}

      <div className="grid md:grid-cols-2 gap-8 px-5 md:px-10 lg:px-20 xl:px-32 py-10">
        {/* Left Section - Memoized Contact Details */}
        <div className="space-y-6">
          <ContactDetail
            icon={Mail}
            title="E-mail"
            content="customer.care@foxskyindia.com"
          />
          <ContactDetail
            icon={MapPin}
            title="Address"
            content="49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar Pradesh, India 201010."
          />
          <ContactDetail
            icon={Phone}
            title="Reach out to us at"
            content="+91-7079797902"
          />
        </div>

        {/* Right Section - Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
            />
            <InputField
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Your subject"
            />
          </div>

          <TextAreaField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write message"
          />

          <SubmitButton loading={loading} />
        </form>
      </div>
    </div>
  );
}

// Memoized input components
const InputField = memo(({ label, ...props }) => (
  <div>
    <label className="block text-lg font-semibold mb-2 text-gray-700">
      {label}
    </label>
    <input
      className="w-full py-4 px-4 bg-gray-200 rounded-[25px] outline-none"
      {...props}
    />
  </div>
));

const TextAreaField = memo(({ label, ...props }) => (
  <div>
    <label className="block text-lg font-semibold mb-2 text-gray-700">
      {label}
    </label>
    <textarea
      className="w-full py-4 px-4 resize-none bg-gray-200 rounded-[25px] outline-none"
      rows="5"
      {...props}
    />
  </div>
));

const SubmitButton = memo(({ loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="bg-[#01210f] p-3 px-10 rounded-2xl text-white cursor-pointer disabled:bg-gray-400"
  >
    {loading ? "Sending..." : "Send Message"}
  </button>
));

export default Section1;
