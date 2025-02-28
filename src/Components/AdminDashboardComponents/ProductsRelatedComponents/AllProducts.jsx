import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaEdit,
    FaTrash,
    FaEye,
    FaSortAmountDown,
    FaSortAmountUp,
    FaPlus,
    FaThLarge,
    FaListUl,
    FaTimes
} from 'react-icons/fa';

// Mock data based on your schema
const mockProducts = [
    {
        _id: '1',
        name: 'Wireless Bluetooth Headphones',
        price: 199.99,
        discount_percentage: 15,
        new_price: 169.99,
        stock: 25,
        warranty_years: 2,
        highlights: [
            'Noise-cancelling technology',
            '40hrs battery life',
            'IPX4 water resistance'
        ],
        specifications: [
            { title: 'Audio', key: 'Frequency Range', value: '20Hz-20kHz' },
            { title: 'Connectivity', key: 'Bluetooth Version', value: '5.0' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'Premium wireless headphones with advanced noise cancellation',
        category: 'Electronics'
    },
    {
        _id: '2',
        name: 'Smart Watch Series 6',
        price: 299.99,
        discount_percentage: 10,
        new_price: 269.99,
        stock: 12,
        warranty_years: 1,
        highlights: [
            'Heart rate monitoring',
            'Sleep tracking',
            'GPS & Cellular'
        ],
        specifications: [
            { title: 'Screen', key: 'Display Size', value: '1.78 inches' },
            { title: 'Battery', key: 'Life', value: '18 hours' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'Smartwatch with health tracking and seamless connectivity',
        category: 'Wearables'
    },
    {
        _id: '3',
        name: 'Gaming Laptop X15',
        price: 1499.99,
        discount_percentage: 20,
        new_price: 1199.99,
        stock: 5,
        warranty_years: 3,
        highlights: [
            'NVIDIA RTX 3070',
            '144Hz Display',
            '16GB RAM'
        ],
        specifications: [
            { title: 'Processor', key: 'CPU', value: 'Intel i7 12th Gen' },
            { title: 'Graphics', key: 'GPU', value: 'NVIDIA RTX 3070' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'High-performance gaming laptop with powerful graphics',
        category: 'Computers'
    },
    {
        _id: '4',
        name: '4K Smart TV 55"',
        price: 799.99,
        discount_percentage: 12,
        new_price: 703.99,
        stock: 7,
        warranty_years: 2,
        highlights: [
            'Dolby Vision & HDR10+',
            'Voice Assistant Support',
            '120Hz Refresh Rate'
        ],
        specifications: [
            { title: 'Display', key: 'Resolution', value: '3840x2160' },
            { title: 'Smart Features', key: 'OS', value: 'Android TV' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'Ultra HD Smart TV with vivid colors and deep blacks',
        category: 'Home Appliances'
    },
    {
        _id: '5',
        name: 'Noise Cancelling Earbuds',
        price: 149.99,
        discount_percentage: 18,
        new_price: 122.99,
        stock: 0, // Out of stock
        warranty_years: 1,
        highlights: [
            'ANC & Transparency mode',
            'Wireless Charging',
            'IPX7 Waterproof'
        ],
        specifications: [
            { title: 'Audio', key: 'Driver Size', value: '10mm' },
            { title: 'Battery', key: 'Playtime', value: '28 hours' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'True wireless earbuds with immersive sound and ANC',
        category: 'Audio'
    },
    {
        _id: '6',
        name: 'Electric Scooter Pro',
        price: 899.99,
        discount_percentage: 5,
        new_price: 854.99,
        stock: 15,
        warranty_years: 2,
        highlights: [
            'Max speed 25mph',
            '30-mile range',
            'Foldable & lightweight'
        ],
        specifications: [
            { title: 'Performance', key: 'Max Speed', value: '25 mph' },
            { title: 'Battery', key: 'Range', value: '30 miles' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'Electric scooter for urban commuting with long battery life',
        category: 'Transportation'
    },
    {
        _id: '7',
        name: 'DSLR Camera 24MP',
        price: 999.99,
        discount_percentage: 10,
        new_price: 899.99,
        stock: 8,
        warranty_years: 3,
        highlights: [
            '4K Video Recording',
            'Fast Autofocus',
            'Interchangeable Lens'
        ],
        specifications: [
            { title: 'Sensor', key: 'Megapixels', value: '24MP' },
            { title: 'Lens', key: 'Mount Type', value: 'EF-M' }
        ],
        image: [
            'https://via.placeholder.com/400',
            'https://via.placeholder.com/400'
        ],
        description: 'Professional DSLR camera with high-resolution sensor',
        category: 'Photography'
    }
];

const AllProducts = () => {
    const [products, setProducts] = useState(mockProducts);
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('price');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null); // For modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const productsPerPage = 6;


    // Open Modal
    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const stockCheck = showOutOfStock ? true : product.stock > 0;

        return matchesSearch && matchesCategory && stockCheck;
    });

    // Sorting logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const modifier = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
            case 'price': return (a.price - b.price) * modifier;
            case 'stock': return (a.stock - b.stock) * modifier;
            case 'name': return a.name.localeCompare(b.name) * modifier;
            case 'category': return a.category.localeCompare(b.category) * modifier;
            default: return 0;
        }
    });

    const getStockStatus = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'In Stock';
    };

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Bulk actions
    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleBulkDelete = () => {
        setProducts(prev => prev.filter(p => !selectedProducts.includes(p._id)));
        setSelectedProducts([]);
        setCurrentPage(1);
    };

    // Single product delete
    const handleDelete = (productId) => {
        setProducts(prev => prev.filter(p => p._id !== productId));
        setSelectedProducts(prev => prev.filter(id => id !== productId));
    };

    // View mode toggle buttons
    const ViewModeToggle = () => (
        <div className="flex gap-2 border rounded-md p-1 bg-gray-100">
            <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
            >
                <FaThLarge />
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
            >
                <FaListUl />
            </button>
        </div>
    );

    // Product Card Component
    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative group">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 flex gap-2">
                        {product.image.slice(1).map((img, index) => (
                            <div key={index} className="w-8 h-8 border-2 border-white rounded-sm overflow-hidden">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openModal(product)} className="p-2 bg-white rounded-full shadow-sm hover:bg-blue-100">
                        <FaEye className="text-gray-600" />
                    </button>
                    <Link
                        to={`/admin-dashboard/edit-product/${product._id}`}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-green-100"
                    >
                        <FaEdit className="text-green-600" />
                    </Link>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStockStatus(product.stock) === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                        getStockStatus(product.stock) === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {getStockStatus(product.stock)}
                    </span>
                    <span className="text-sm text-gray-500">{product.category}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600">
                        ₹{product.new_price ?? product.price}
                        </span>
                        {product.discount_percentage > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-500">
                        Warranty: {product.warranty_years} years
                    </span>
                </div>

                <div className="space-y-2">
                    <button onClick={() => openModal(product)} className="w-full bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors">
                        View Details
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            to={`/admin-dashboard/edit-product/${product._id}`}
                            className="flex items-center justify-center gap-2 bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-md"
                        >
                            <FaEdit /> Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(product._id)}
                            className="flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-md"
                        >
                            <FaTrash /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Modal Component
    const ProductModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
                    onClick={closeModal}
                >
                    <FaTimes size={20} />
                </button>

                <div className="text-center">
                    <img
                        src={selectedProduct.image[0]}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-md"
                    />
                    <h2 className="text-2xl font-bold mt-4">{selectedProduct.name}</h2>
                    <p className="text-gray-500">{selectedProduct.category}</p>

                    <div className="flex items-center justify-center gap-4 mt-3">
                        <span className="text-2xl font-bold text-blue-600">
                        ₹{selectedProduct.new_price ?? selectedProduct.price}
                        </span>
                        {selectedProduct.discount_percentage > 0 && (
                            <span className="text-gray-500 line-through">₹{selectedProduct.price}</span>
                        )}
                    </div>

                    <p className="mt-2 text-gray-600">Warranty: {selectedProduct.warranty_years} years</p>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={closeModal}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    // List View Item Component
    const ListItem = ({ product }) => (
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStockStatus(product.stock) === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                            getStockStatus(product.stock) === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                            {getStockStatus(product.stock)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="text-xl font-bold text-blue-600">
                            ${product.new_price ?? product.price}
                        </span>
                        {product.discount_percentage > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                ${product.price}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        to={`/admin-dashboard/edit-product/${product._id}`}
                        className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                    >
                        <FaEdit />
                    </Link>
                    <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-gray-50 p-8 pt-14">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                    <div className="flex items-center gap-4">
                        <ViewModeToggle />
                        <Link
                            to="/admin-dashboard/addproduct"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus /> Add Product
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="p-2 border rounded-md"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        <select
                            className="p-2 border rounded-md"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="all">All Categories</option>
                            {[...new Set(products.map(p => p.category))].map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2">
                            <select
                                className="p-2 border rounded-md flex-1"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="price">Price</option>
                                <option value="stock">Stock</option>
                                <option value="name">Name</option>
                                <option value="category">Category</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border rounded-md hover:bg-gray-100"
                            >
                                {sortOrder === 'asc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="outOfStock"
                                checked={showOutOfStock}
                                onChange={(e) => {
                                    setShowOutOfStock(e.target.checked);
                                    setCurrentPage(1);
                                }}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                            />
                            <label htmlFor="outOfStock" className="text-sm">Show Out of Stock</label>
                        </div>
                    </div>

                    {selectedProducts.length > 0 && (
                        <div className="bg-yellow-100 p-4 rounded-md flex items-center justify-between">
                            <span>{selectedProducts.length} selected</span>
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                            >
                                <FaTrash /> Delete Selected
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Display */}
                {sortedProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No products found matching your criteria
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentProducts.map(product => (
                            <ListItem key={product._id} product={product} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded-md ${currentPage === i + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            {/* Product Details Modal */}
            {isModalOpen && <ProductModal />}
        </div>
    );
};

export default AllProducts;