import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = () => {
        toast.dismiss();
        if (!formData.email.trim()) {
            toast.error("Email is required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Invalid email format.");
            return false;
        }
        return true;
    };

    const validateOtp = () => {
        if (!formData.otp.trim() || formData.otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return false;
        }
        return true;
    };

    const validatePassword = () => {
        if (!formData.newPassword.trim()) {
            toast.error("New password is required.");
            return false;
        }
        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;

        try {
            setLoading(true);
            await axios.post(`${backend}/otp/send-email-otp-forgot-password`, { email: formData.email });
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        if (!validateOtp()) return;

        try {
            setLoading(true);
            await axios.post(`${backend}/otp/verify-email-otp`, {
                email: formData.email,
                otp: formData.otp
            });
            toast.success("OTP verified successfully!");
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP.");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        try {
            setLoading(true);
            await axios.post(`${backend}/auth/change-password`, {
                email: formData.email,
                newPassword: formData.newPassword
            });
            toast.success("Password reset successfully!");
            navigate('/signin');
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
                <h2 className="text-2xl font-semibold text-center mb-6 lg:text-4xl lg:mb-10">
                    Forgot Password
                </h2>

                {step === 1 && (
                    <form className="space-y-4" onSubmit={sendOtp}>
                        <div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Send OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form className="space-y-4" onSubmit={verifyOtp}>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={formData.otp}
                                maxLength={6}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-600 text-sm hover:underline"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={sendOtp}
                                className="text-gray-600 text-sm hover:underline"
                            >
                                Resend OTP
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form className="space-y-4" onSubmit={resetPassword}>
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-gray-600 text-sm hover:underline"
                            >
                                Back
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="text-center mt-4">
                    <Link to='/signin' className="text-gray-600 text-sm hover:underline">
                        Remember your password? Sign In
                    </Link>
                </div>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    );
}

export default ForgotPassword;