import React from 'react';
import { Link } from 'react-router-dom';

function SignUp() {
    return (
        <div className="flex items-center justify-center min-h-[90vh]">
            <div className="bg-white p-8 rounded-lg w-full max-w-xl">
                <h2 className="text-3xl font-semibold text-center mb-6">Create Account</h2>

                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="First name"
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <input
                        type="text"
                        placeholder="Last name"
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />

                    <input
                        type="password"
                        placeholder="Password"
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
        </div>
    );
}

export default SignUp;
