import { useState, useEffect } from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
// import axios from 'axios';  // Commented out API call

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [sort, setSort] = useState('NEWEST');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const itemsPerPage = 5;

    // Mock data for testing
    const fakeOrders = [
        {
            _id: '1',
            product_id: { name: 'Wireless Headphones', image: ['/headphones.jpg'], sku: 'WH-123' },
            user_id: { name: 'John Doe', email: 'john@example.com' },
            quantity: 2,
            total_price: 120,
            status: 'PENDING',
            created_at: '2024-02-20T12:00:00Z'
        },
        {
            _id: '2',
            product_id: { name: 'Smart Watch', image: ['/watch.jpg'], sku: 'SW-456' },
            user_id: { name: 'Jane Smith', email: 'jane@example.com' },
            quantity: 1,
            total_price: 250,
            status: 'COMPLETED',
            created_at: '2024-02-18T10:30:00Z'
        },
        {
            _id: '3',
            product_id: { name: 'Laptop', image: ['/laptop.jpg'], sku: 'LP-789' },
            user_id: { name: 'Alice Brown', email: 'alice@example.com' },
            quantity: 1,
            total_price: 1200,
            status: 'CANCELLED',
            created_at: '2024-02-15T09:00:00Z'
        }
    ];

    useEffect(() => {
        // Commenting out API call for now
        /*
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `/api/orders?page=${currentPage}&limit=${itemsPerPage}&filter=${filter}&sort=${sort}`
                );
                setOrders(response.data.orders);
                setTotalOrders(response.data.total);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
        */

        // Simulating an API response with fake data
        setOrders(fakeOrders);
        setTotalOrders(fakeOrders.length);
    }, [filter, sort, currentPage]);

    const getStatusBadge = (status) => {
        const statusConfig = {
            PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock className="w-4 h-4 mr-1" /> },
            COMPLETED: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="w-4 h-4 mr-1" /> },
            CANCELLED: { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="w-4 h-4 mr-1" /> }
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status]?.color}`}>
                {statusConfig[status]?.icon}
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 w-full py-14">
            {/* Header & Filters */}
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="mt-2 text-sm text-gray-700">Total {totalOrders} orders found</p>
                </div>
            </div>

            {/* Orders Table - Responsive */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Order Details', 'User', 'Qty', 'Total Price', 'Status', 'Date'].map((header) => (
                                    <th key={header} className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-gray-900">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.map((order) => (
                                <tr key={order._id} className="text-xs sm:text-sm">
                                    <td className="py-4 px-3 flex items-center space-x-3">
                                        <img src={order.product_id?.image?.[0]} alt={order.product_id?.name} className="h-12 w-12 rounded object-cover sm:h-16 sm:w-16" />
                                        <div>
                                            <div className="font-medium text-gray-900">{order.product_id?.name}</div>
                                            <div className="text-gray-500 text-xs sm:text-sm">SKU: {order.product_id?.sku || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-500">
                                        <div className="font-medium">{order.user_id?.name}</div>
                                        <div className="text-gray-400 text-xs sm:text-sm">{order.user_id?.email}</div>
                                    </td>
                                    <td className="px-3 py-4 text-gray-500">{order.quantity}</td>
                                    <td className="px-3 py-4 font-medium text-gray-900">{formatCurrency(order.total_price)}</td>
                                    <td className="px-3 py-4 text-gray-500">{getStatusBadge(order.status)}</td>
                                    <td className="px-3 py-4 text-gray-500 whitespace-nowrap">{formatDate(order.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllOrders;
