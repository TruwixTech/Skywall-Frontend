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
  const [showPassword, setShowPassword] = useState(false);

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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 pr-12"
              value={formData.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-gray-600 text-sm hover:underline">
              Forgot your password?
            </Link>
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
