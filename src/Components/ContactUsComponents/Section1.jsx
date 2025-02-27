import React from 'react'
import { useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

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
            await axios.post("", formData);
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
            console.error("Error sending message:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='w-full min-h-screen flex  flex-col '>


            <div className=' w-full px-5 md:px-10   flex flex-col items-center'>
                <h1 className='md:text-5xl text-2xl text-center md:py-6 py-4 font-semibold xl:text-5xl'>Contact Us</h1>
                <p className='md:text-lg md:px-24 md:w-[90%] w-full text-[16px] text-center text-gray-500 md:py-4 py-2'>We’re happy to answer any questions you have or provide you with an estimate. Just send us an Email message with any questions or complaints you may have.</p>
            </div>

            {/* form */}
            <div className="grid md:grid-cols-2 gap-8 pt-10 md:px-10 px-5  py-10">
                {/* Left Section - Contact Details */}
                <div className="space-y-6 mt-8">

                    <h3 className="md:text-7xl text-5xl font-bold text-black leading-15">
                        Contact us For <br /> Support
                    </h3>

                    <div>
                        <h4 className="font-semibold text-2xl text-[#373f43] mb-2">E-mail</h4>
                        <p className="text-[#8c959f] flex gap-4 items-center">
                            <span><MdOutlineMail size={20} /></span>customer.care@foxskyindia.com
                        </p>
                        {/* <p className="text-[#8c959f] flex gap-4 items-center">
              <span><img src={mailicon} alt="" /></span> agritechinnovation24@gmail.com
            </p> */}
                    </div>

                    {/* <div>
            <h4 className="font-semibold text-2xl text-[#373f43] mb-4">Company Name</h4>
            <p className="text-[#8c959f] flex gap-4 items-center">
              <span><MdLocationPin size={24}/></span> Foxsky Electronics India Pvt. Ltd
            </p>
          </div> */}
                    <div>
                        <h4 className="font-semibold text-2xl text-[#373f43] mb-2">Address</h4>
                        <p className="text-[#8c959f] flex gap-4 items-center">
                            <span><MdLocationPin size={25} /></span> 49/26 Site: 4, Sahibabad Industrial Area Ghaziabad, Uttar Pradesh, India 201010.
                        </p>
                    </div>


                    <div>
                        <h4 className="font-semibold text-2xl text-[#373f43] mb-2">Reach out to us at</h4>
                        <p className="text-[#8c959f] flex gap-4 items-center">
                            <span><FaPhoneAlt size={25} /></span> +91-7079797902
                        </p>
                    </div>
                </div>

                {/* Right Section - Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-lg font-bold mb-2 text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-lg font-bold mb-2 text-gray-700">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Your email address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone */}
                        <div>
                            <label className="block text-lg font-bold mb-2 text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Your Phone Number"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-lg font-bold mb-2 text-gray-700">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full py-4 px-4 bg-gray-200 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-green-600"
                                placeholder="Your subject"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-lg font-bold mb-2 text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full py-4 px-4 resize-none bg-gray-200 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-green-600"
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
    )
}

export default Section1