import React from 'react';
import { Link } from 'react-router-dom';

function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <div className="bg-white p-4 md:p-8 rounded-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center mb-6 lg:text-4xl lg:mb-10">Login</h2>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <input
              type="password"
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
    </div>
  );
}

export default SignIn;
