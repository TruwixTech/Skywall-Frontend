import React, { useEffect, useState } from 'react';
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
    FaTimes,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../../utils/LoadingSpinner';
import EditProduct from './EditProductForm';

const backend = import.meta.env.VITE_BACKEND

const AllProducts = () => {
    const [products, setProducts] = useState([]);
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
    const [loading, setLoading] = useState(false);
    const [editPopUp, setEditPopUp] = useState(false);
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

    // Open Modal for delete products
    const openModalDelete = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    // Close Modal  for delete products
    const closeModalDelete = () => {
        setSelectedProduct(null);
        setIsDeleteModalOpen(false);
    };

    // Open Modal for edit products
    const openEditModal = (product) => {
        setSelectedProduct(product);
        setEditPopUp(true);
    };

    // Close Modal for edit products
    const closeEditModal = () => {
        setSelectedProduct(null);
        setEditPopUp(false);
    };


    // Filtering logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const stockCheck = showOutOfStock ? true : product.stock >= 0;

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
        openModalDelete(productId);
    };

    async function deleteProduct(id) {
        toast.dismiss()
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/product/${id}/remove`, {}, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                },
            });
            if (response.data.status === "Success") {
                setLoading(false);
                setSelectedProduct(null)
                toast.success('Product deleted successfully.');
                fetchAllProducts()
                closeModalDelete()
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    }

    async function fetchAllProducts() {
        try {
            setLoading(true);
            const response = await axios.post(`${backend}/product/list`, {
                pageNum: currentPage,
                pageSize: productsPerPage,
                filters: {}
            });
            if (response.data.status === "Success") {
                setLoading(false);
                setProducts(response.data.data.productList);
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, [])

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
                    <button
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-green-100"
                    >
                        <FaEdit className="text-green-600" />
                    </button>
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
                        <button
                            onClick={() => openEditModal(product)}
                            className="flex items-center justify-center gap-2 bg-green-100 text-green-600 hover:bg-green-200 p-2 rounded-md"
                        >
                            <FaEdit /> Edit
                        </button>
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

    const DeleteConfirmationModal = () => {
        if (!isDeleteModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                        onClick={closeModalDelete}
                    >
                        <FaTimes size={20} />
                    </button>

                    {/* Modal Content */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-800">
                            Are you sure you want to delete this product?
                        </h2>
                        <p className="text-gray-500 mt-2">This action cannot be undone.</p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={closeModalDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteProduct(selectedProduct)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Modal Component
    const ProductModal = () => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);

        // Function to go to the next image
        const nextImage = () => {
            if (currentImageIndex < selectedProduct.image.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1);
            }
        };

        // Function to go to the previous image
        const prevImage = () => {
            if (currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative overflow-hidden">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                        onClick={closeModal}
                    >
                        <FaTimes size={22} />
                    </button>

                    {/* Scrollable Content */}
                    <div className="max-h-[80vh] overflow-y-auto p-2" style={{
                        scrollbarWidth: "thin"
                    }}>
                        {/* Image Carousel */}
                        <div className="relative">
                            <img
                                src={selectedProduct.image[currentImageIndex]}
                                alt={selectedProduct.name}
                                className="w-full h-64 object-cover rounded-md"
                            />

                            {/* Left Button */}
                            {currentImageIndex > 0 && (
                                <button
                                    className="absolute top-1/2 left-2 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
                                    onClick={prevImage}
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                            )}

                            {/* Right Button */}
                            {currentImageIndex < selectedProduct.image.length - 1 && (
                                <button
                                    className="absolute top-1/2 right-2 bg-black/50 text-white p-2 rounded-full transform -translate-y-1/2"
                                    onClick={nextImage}
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            )}
                        </div>

                        {/* Product Details */}
                        <h2 className="text-2xl font-bold mt-4">{selectedProduct.name}</h2>
                        <p className="text-gray-500">{selectedProduct.category}</p>
                        <p className="text-gray-500">{selectedProduct.companyName}</p>

                        {/* Pricing Section */}
                        <div className="flex items-center gap-4 mt-3">
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{selectedProduct.new_price ?? selectedProduct.price}
                            </span>
                            {selectedProduct.discount_percentage > 0 && (
                                <span className="text-gray-500 line-through">
                                    ₹{selectedProduct.price}
                                </span>
                            )}
                        </div>

                        <p className="mt-2 text-gray-600">
                            Warranty:{" "}
                            {selectedProduct.warranty_months >= 12
                                ? `${(selectedProduct.warranty_months / 12).toFixed(1)} years`
                                : `${selectedProduct.warranty_months} months`}
                        </p>
                        <p className="mt-2 text-gray-600">Stock: {selectedProduct.stock} units available</p>

                        {/* Highlights */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Highlights</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {selectedProduct?.highlights?.map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Specifications */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Specifications</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {selectedProduct?.specificationSchema?.map((spec, index) => (
                                    <li key={index} className="mb-2">
                                        <strong className="text-black">{spec.title}:</strong>
                                        <ul className="list-none ml-4">
                                            {spec.data.map((item, idx) => (
                                                <li key={idx} className="text-gray-700">
                                                    {item.key}: {item.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* Description */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Description</h3>
                            <p className="text-gray-600">{selectedProduct.description}</p>
                        </div>
                    </div>

                    {/* Close Button */}
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
    };

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
        <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-blue-50 p-8 pt-14">
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
                            {[...new Set(products.map(p => p.category))].map((category, index) => (
                                <option key={index} value={category}>{category}</option>
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
                        <div className="bg-yellow-100 p-4 rounded-md flex flex-col gap-4 md:flex-row items-center justify-between">
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
            {/* Product delete modal */}
            {isDeleteModalOpen && <DeleteConfirmationModal />}
            {/* LoadingSpinner */}
            {loading && <LoadingSpinner />}
            {/* Edit Popup */}
            {editPopUp && <EditProduct selectedProduct={selectedProduct} onOpen={openEditModal} onClose={closeEditModal} fetchAllProducts={fetchAllProducts} />}
        </div>
    );
};

export default AllProducts;