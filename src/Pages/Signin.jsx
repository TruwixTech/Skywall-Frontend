import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../utils/LoadingSpinner';

const backend = import.meta.env.VITE_BACKEND;

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  function validateForm() {
    const { email, password } = formData;
    toast.dismiss()
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
    }

    return true;
  }

  async function signin(e) {
    e.preventDefault()
    if (!validateForm()) return; // Stop if validation fails
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/auth/login`, formData)
      if (response.data.status === 'Success') {
        localStorage.setItem('token', JSON.stringify(response.data.data.token))
        setLoading(false)
        toast.success('Login successful!')
        setFormData({
          email: '',
          password: ''
        })
        navigate('/')
      }
    } catch (error) {
      setLoading(false)
      console.log(error.response.data.data.message || error);
      toast.error(error.response.data.data.message || "Signin failed.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center mb-6 lg:text-4xl lg:mb-10">Login</h2>

        <form className="space-y-4" onSubmit={signin}>
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

          <div className="text-right">
            <a href="#" className="text-gray-600 text-sm hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Sign in
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to='/signup' className="text-gray-600 text-sm hover:underline">
            Create account
          </Link>
        </div>
      </div>
      {
        loading && <LoadingSpinner />
      }
    </div>
  );
}

export default SignIn;
