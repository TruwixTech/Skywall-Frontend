import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../utils/LoadingSpinner';

// Mock enum values - replace with your actual imports
const BUSINESS = 'Business';
const USER = 'User';

const roleStyles = {
    [BUSINESS]: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
    [USER]: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
};

const backend = import.meta.env.VITE_BACKEND;

function UserProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        created_at: '',
        updated_at: '',
        _id: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const navigate = useNavigate();

    const handleEditClick = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }
        // Check if email has changed
        if (user.email !== originalEmail) {
            try {
                setLoading(true);
                await axios.post(`${backend}/otp/send-email-otp`, { email: user.email });
                toast.success("OTP sent to your new email!");
                setShowOtpVerification(true);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to send OTP.");
            } finally {
                setLoading(false);
            }
        } else {
            editProfile();
        }
    };

    const validateForm = () => {
        let errors = {};
        toast.dismiss();

        // Trim all values before validation
        const trimmedName = user.name?.trim();
        const trimmedEmail = user.email?.trim();
        const trimmedPhone = user.phone?.toString().trim();
        const trimmedAddress = user.address?.trim();

        // Name Validation
        if (!trimmedName) {
            errors.name = "Name is required";
        } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
            errors.name = "Name should contain only letters";
        }

        // Email Validation
        if (!trimmedEmail) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = "Invalid email format";
        }

        // Phone Validation
        if (!trimmedPhone) {
            errors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(trimmedPhone)) {
            errors.phone = "Phone must be 10 digits";
        }

        // Address Validation
        if (!trimmedAddress) {
            errors.address = "Address is required";
        }

        return errors;
    };

    const editProfile = async (providedOtp = null) => {
        try {
            setLoading(true);
            const payload = {
                user: user,
                ...(user.email !== originalEmail && { otp: providedOtp })
            };

            const response = await axios.post(`${backend}/user/${user._id}/update`, payload, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });

            if (response.data.status === "Success") {
                setIsEditing(false);
                setOriginalEmail(user.email);
                toast.success("Profile updated successfully!");
                setShowOtpVerification(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndSave = async (e) => {
        e.preventDefault();
        if (!otp.trim() || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);
            // Verify OTP first
            const verifyResponse = await axios.post(`${backend}/otp/verify-email-otp`, {
                email: user.email,
                otp: otp
            });

            if (verifyResponse.data.status === "Success") {
                await editProfile(otp);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            setLoading(true);
            await axios.post(`${backend}/otp/send-email-otp`, { email: user.email });
            toast.success("OTP resent successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    function convertToIST(utcTimestamp) {
        // Ensure the timestamp is properly parsed as a Date object
        let date = new Date(utcTimestamp);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        // Convert to IST (UTC +5:30)
        let istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        let istDate = new Date(date.getTime() + istOffset);

        // Format the date
        let options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Kolkata'
        };

        return istDate.toLocaleString('en-IN', options);
    }

    async function fetchUserDetails(id) {
        try {
            setLoading(true)
            const response = await axios.get(`${backend}/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            if (response.data.status === "Success") {
                const { name, email, phone, address, role, created_at, updated_at, _id } = response.data.data.user
                setUser({ name, email, phone, address, role, created_at, updated_at, _id })
                setLoading(false)
                setOriginalEmail(email)
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setLoading(false)
        }
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {
            const decodedToken = jwtDecode(token)
            fetchUserDetails(decodedToken.userId)
        }
        else {
            navigate('/signin')
        }
    }, [])

    return (
        <div className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {/* OTP Verification Modal */}
            {showOtpVerification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Verify Your Email</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                We've sent a 6-digit OTP to your new email address.
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                maxLength={6}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleVerifyAndSave}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                            >
                                Verify OTP
                            </button>
                            <button
                                onClick={resendOtp}
                                className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all"
                            >
                                Resend OTP
                            </button>
                            <button
                                onClick={() => {
                                    setShowOtpVerification(false);
                                    setUser({ ...user, email: originalEmail });
                                }}
                                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="mx-auto max-w-4xl">
                {/* Profile Card */}
                {
                    loading
                        ? <LoadingSpinner />
                        : <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
                            {/* Profile Header with Gradient Background */}
                            <div className={`bg-gradient-to-r ${roleStyles[user.role]} p-6 md:p-8`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-white">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={user?.name}
                                                    onChange={handleInputChange}
                                                    className="bg-transparent border-b border-white outline-none placeholder-white"
                                                    placeholder="Full Name"
                                                />
                                            ) : (
                                                user?.name
                                            )}
                                        </h1>
                                        <span className="mt-2 inline-flex rounded-full px-4 py-1 text-black text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm">
                                            {user?.role} Account
                                        </span>
                                    </div>
                                    <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-3xl font-bold text-black">
                                            {user?.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
                                {/* Personal Information Section */}
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">👤</span> Personal Information
                                    </h2>
                                    <dl className="space-y-4">
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={user?.email}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-transparent border-b border-gray-300 outline-none"
                                                    />
                                                ) : (
                                                    user?.email
                                                )}
                                            </dd>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={user?.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-transparent border-b border-gray-300 outline-none"
                                                    />
                                                ) : (
                                                    user?.phone
                                                )}
                                            </dd>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={user?.address}
                                                        placeholder={user?.address || 'Enter your address'}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-transparent border-b border-gray-300 outline-none"
                                                    />
                                                ) : (
                                                    user.address
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Account Details Section */}
                                <div>
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">🔒</span> Account Details
                                    </h2>
                                    <dl className="space-y-4">
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {convertToIST(user?.created_at)}
                                            </dd>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                            <dd className="mt-1 text-gray-900">
                                                {convertToIST(user?.updated_at)}
                                            </dd>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <dt className="text-sm font-medium text-gray-500">Account Status</dt>
                                            <dd className="mt-1 text-green-600 font-medium">Active</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Footer with Edit Button */}
                            <div className="border-t border-gray-200 p-6 md:p-8">
                                <button
                                    onClick={handleEditClick}
                                    className="w-full md:w-auto px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-shadow"
                                >
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}

export default UserProfile;