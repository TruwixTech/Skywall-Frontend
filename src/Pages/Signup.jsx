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
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    function validateForm() {
        const { name, phone, email, password } = formData;
        toast.dismiss()
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

    async function signup(e) {
        e.preventDefault();

        if (!validateForm()) return; // Stop if validation fails

        try {
            setLoading(true)
            const response = await axios.post(`${backend}/auth/signup`, formData);
            if (response.data.status === "Success") {
                toast.success("Account created successfully!");
                setLoading(false)
                localStorage.setItem("token", JSON.stringify(response.data.data.token))
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    password: ''
                })
                navigate('/')
            } else {
                toast.error(response.data.message || "Signup failed.");
            }
        } catch (error) {
            setLoading(false)
            console.log(error.response.data.data.message || error);
            toast.error(error.response.data.data.message || "Signup failed.");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
                <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>

                <form className="space-y-4" onSubmit={signup}>
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="Phone"
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
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#121212] text-white p-3 rounded-lg hover:bg-[#121212a8] transition duration-300 text-lg font-semibold"
                    >
                        Create
                    </button>
                </form>

                {/* Already have an account */}
                <div className="text-center mt-4">
                    <p className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link to='/signin' className="text-[#636363] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            {
                loading && <LoadingSpinner />
            }
        </div>
    );
}

export default SignUp;
