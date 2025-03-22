import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    function validateForm() {
        const { name, phone, email, password } = formData;
        toast.dismiss();
        if (!name.trim()) {
            toast.error("Name is required.");
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            toast.error("Name should only contain letters");
            return false;
        }

        if (!phone.trim()) {
            toast.error("Phone number is required.");
            return false;
        } else if (!/^\d{10}$/.test(phone)) {
            toast.error("Phone number must be exactly 10 digits.");
            return false;
        }

        if (!email.trim()) {
            toast.error("Email is required.");
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error("Invalid email format.");
            return false;
        }

        if (!password.trim()) {
            toast.error("Password is required.");
            return false;
        } else if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await axios.post(`${backend}/otp/send-email-otp`, { email: formData.email });
            toast.success("OTP sent to your email!");
            setShowOtpVerification(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    }

    async function verifyOtp(e) {
        e.preventDefault();
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            // Verify OTP
            const verifyResponse = await axios.post(`${backend}/otp/verify-email-otp`, {
                email: formData.email,
                otp: otp
            });

            if (verifyResponse.data.status === "Success") {
                // Create account after successful verification
                const signupResponse = await axios.post(`${backend}/auth/signup`, formData);
                if (signupResponse.data.status === "Success") {
                    toast.success("Account created successfully!");
                    localStorage.setItem("token", JSON.stringify(signupResponse.data.data.token));
                    setFormData({ name: '', phone: '', email: '', password: '' });
                    setOtp('');
                    navigate('/');
                }
            } else {
                toast.error(verifyResponse.data.message || "OTP verification failed.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during verification.");
        } finally {
            setLoading(false);
        }
    }

    async function resendOtp() {
        try {
            setLoading(true);
            await axios.post(`${backend}/otp/send-email-otp`, { email: formData.email });
            toast.success("OTP resent successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
                {!showOtpVerification ? (
                    <>
                        <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />

                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) {
                                        setFormData({ ...formData, phone: value });
                                    }
                                }}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />

                            <button
                                type="submit"
                                className="w-full bg-[#121212] text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300 text-lg font-semibold"
                            >
                                Create
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-semibold text-center mb-6">Verify Email</h2>
                        <form className="space-y-4" onSubmit={verifyOtp}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#121212] text-white p-3 rounded-lg hover:bg-[#121212a8] transition duration-300 text-lg font-semibold"
                            >
                                Verify OTP
                            </button>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={resendOtp}
                                    className="text-sm text-gray-600 hover:underline"
                                >
                                    Resend OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowOtpVerification(false)}
                                    className="text-sm text-gray-600 hover:underline"
                                >
                                    Back to Sign Up
                                </button>
                            </div>
                        </form>
                    </>
                )}

                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link to='/signin' className="text-[#636363] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
}

export default SignUp;