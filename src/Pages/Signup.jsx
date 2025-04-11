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
    const [showPassword, setShowPassword] = useState(false);
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
            console.log(error);
            toast.error(error.response?.data?.data?.message || "An error occurred during verification.");
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

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

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