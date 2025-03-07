import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function RaiseComplaint() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        issueType: '',
        description: '',
    });

    const navigate = useNavigate()

    const [complaints, setComplaints] = useState([
        {
            id: 1,
            issueType: 'Technical',
            description: 'Unable to log in to my account.',
            status: 'Resolved',
            date: '2023-10-01',
        },
        {
            id: 2,
            issueType: 'Billing',
            description: 'Incorrect charge on my credit card.',
            status: 'In Progress',
            date: '2023-10-05',
        },
        {
            id: 3,
            issueType: 'Service',
            description: 'Poor customer service experience.',
            status: 'Pending',
            date: '2023-10-10',
        },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let errors = {};
        toast.dismiss()

        // Name Validation: Only letters and spaces allowed
        if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
            errors.name = "Name should contain only letters.";
        }

        // Email Validation: Basic email regex
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            errors.email = "Invalid email format.";
        }

        // Phone Number Validation: Exactly 10 digits
        if (!/^\d{10}$/.test(formData?.phone?.toString().trim())) {
            errors.phone = "Phone number must be exactly 10 digits.";
        }

        // Address Validation: Cannot be empty
        if (!formData.description.trim()) {
            errors.address = "Address cannot be empty.";
        }

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.dismiss()
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => toast.error(error, "error"));
            return
        }
        const newComplaint = {
            id: complaints.length + 1,
            issueType: formData.issueType,
            description: formData.description,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
        };
        setComplaints([...complaints, newComplaint]);
        alert('Your complaint has been submitted successfully!');
        setFormData({
            name: '',
            email: '',
            phone: '',
            issueType: '',
            description: '',
        });
    };

    const statusStyles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        Resolved: 'bg-green-100 text-green-800',
    };


    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {
            const decodedToken = jwtDecode(token)
            if (!decodedToken.userId) {
                navigate('/signin')
            }
        }
        else {
            navigate('/signin')
        }
    }, [])



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Raise a Complaint</h1>
                    <p className="mt-2 text-gray-600">
                        We're here to help! Please provide the details of your issue.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Complaint Form */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Issue Type */}
                            <div>
                                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700">
                                    Issue Type
                                </label>
                                <div className="mt-1">
                                    <select
                                        name="issueType"
                                        id="issueType"
                                        value={formData.issueType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select an issue type
                                        </option>
                                        <option value="Technical">Technical Issue</option>
                                        <option value="Billing">Billing Issue</option>
                                        <option value="Service">Service Issue</option>
                                        <option value="Shipping">Shipping Issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full px-4 py-2 border resize-none border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Describe your issue in detail"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                                >
                                    Submit Complaint
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Previous Complaints */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Previous Complaints</h2>
                        {complaints.length === 0 ? (
                            <p className="text-gray-500">No complaints found.</p>
                        ) : (
                            <div className="space-y-4">
                                {complaints.map((complaint) => (
                                    <div
                                        key={complaint.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className='w-[60%] sm:w-auto'>
                                                <h3 className="font-semibold text-gray-900">{complaint.issueType}</h3>
                                                <p className="text-sm text-gray-600">{complaint.description}</p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center w-[40%] sm:w-auto justify-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusStyles[complaint.status]}`}
                                            >
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Raised on: {complaint.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RaiseComplaint;