import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND

function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    async function adminLogin(e) {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axios.post(`${backend}/admin/login`, formData)
            if (response.data.status === 'Success') {
                const token = response.data.data.admin.token
                localStorage.setItem("token", JSON.stringify(token))
                toast.success("Login Successfull")
                setFormData({
                    email: "",
                    password: ""
                })
            setLoading(false)
                navigate('/admin-dashboard')
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
                <h2 className="text-2xl font-semibold text-center mb-6 lg:text-4xl lg:mb-10">Admin Login</h2>

                <form className="space-y-6" onSubmit={adminLogin}>
                    <div>
                        <input
                            type="email"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Email"
                            className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Password"
                            className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Sign in
                    </button>
                </form>
            </div>
            {
                loading && <LoadingSpinner />
            }
        </div>
    );
}

export default AdminLogin;
