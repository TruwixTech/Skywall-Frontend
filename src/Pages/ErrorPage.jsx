import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
            <h1 className="text-9xl font-bold text-gray-600 select-none">404</h1>
            <p className="text-2xl md:text-3xl font-light mt-4">Oops! Page Not Found</p>
            <p className="text-gray-400 mt-2 text-center">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <Link to="/" className="mt-6">
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-md transition">
                    Go Back Home
                </button>
            </Link>

            {/* Floating Effect */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-pink-500 opacity-30 rounded-full blur-3xl"></div>
        </div>
    );
};

export default NotFound;
