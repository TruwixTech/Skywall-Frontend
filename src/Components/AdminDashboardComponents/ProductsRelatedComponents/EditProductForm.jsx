import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../utils/LoadingSpinner";

const backend = import.meta.env.VITE_BACKEND;

const EditProduct = ({ selectedProduct, onOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        discount_percentage: "",
        new_price: "",
        stock: "",
        warranty_years: "",
        highlights: [],
        specifications: [],
        description: "",
        category: "",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (onOpen && selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                price: selectedProduct.price,
                discount_percentage: selectedProduct.discount_percentage,
                new_price: selectedProduct.new_price,
                stock: selectedProduct.stock,
                warranty_years: selectedProduct.warranty_years,
                highlights: selectedProduct.highlights || [],
                specifications: selectedProduct.specificationSchema || [],
                description: selectedProduct.description,
                category: selectedProduct.category,
            });

            setExistingImages(selectedProduct.image || []);
            setNewImages([]);
        }
    }, [onOpen, selectedProduct]);

    useEffect(() => {
        const newImagePreviews = newImages.map(file => URL.createObjectURL(file));
        setPreviewImages([...existingImages, ...newImagePreviews]);
    }, [existingImages, newImages]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        if (index < existingImages.length) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            const newIndex = index - existingImages.length;
            setNewImages(prev => prev.filter((_, i) => i !== newIndex));
        }
    };

    const handleHighlightChange = (index, e) => {
        const newHighlights = [...formData.highlights];
        newHighlights[index] = e.target.value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };

    const handleSpecChange = (index, e) => {
        const { name, value } = e.target;
        const newSpecs = [...formData.specifications];
        newSpecs[index][name] = value;
        setFormData(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { title: "", key: "", value: "" }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formDataToSend = new FormData();

            // Append basic fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'highlights' || key === 'specifications') {
                    formDataToSend.append(key, JSON.stringify(value));
                } else if (value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            // Append images
            formDataToSend.append("existingImages", JSON.stringify(existingImages));
            newImages.forEach(file => formDataToSend.append("img", file));

            console.log(formData)
            // const response = await axios.put(
            //     `${backend}/product/${selectedProduct._id}/update`,
            //     formDataToSend,
            //     {
            //         headers: {
            //             "Content-Type": "multipart/form-data",
            //             Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            //         },
            //     }
            // );

            // if (response.data.status === "SUCCESS") {
            //     toast.success("Product updated successfully!");
            //     onClose();
            // }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        onOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-screen overflow-y-auto">
                    <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={onClose}>
                        <IoClose size={22} />
                    </button>

                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Product Name */}
                        <div>
                            <label className="block mb-1 font-medium">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block mb-1 font-medium">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        {/* Pricing Section */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1 font-medium">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount_percentage"
                                    value={formData.discount_percentage}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        {/* Images Section */}
                        <div>
                            <label className="block mb-1 font-medium">Product Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 border rounded-md w-full"
                            />
                            <div className="flex gap-2 flex-wrap mt-2">
                                {previewImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white h-6 w-6 flex justify-center items-center rounded-full"
                                        >
                                            <IoClose size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Highlights Section */}
                        <div>
                            <label className="block mb-1 font-medium">Highlights</label>
                            {formData.highlights.map((highlight, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={highlight}
                                        onChange={(e) => handleHighlightChange(index, e)}
                                        className="flex-1 p-2 border rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            highlights: prev.highlights.filter((_, i) => i !== index)
                                        }))}
                                        className="bg-red-500 text-white px-3 rounded-md"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    highlights: [...prev.highlights, ""]
                                }))}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                            >
                                Add Highlight
                            </button>
                        </div>

                        {/* Specifications Section */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Specifications</label>
                            {formData.specifications.map((spec, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3">
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            name="title"
                                            value={spec.title}
                                            onChange={(e) => handleSpecChange(index, e)}
                                            placeholder="Title"
                                            className="p-2 border rounded-md w-full"
                                        />
                                        <input
                                            type="text"
                                            name="key"
                                            value={spec.key}
                                            onChange={(e) => handleSpecChange(index, e)}
                                            placeholder="Key"
                                            className="p-2 border rounded-md w-full"
                                        />
                                        <input
                                            type="text"
                                            name="value"
                                            value={spec.value}
                                            onChange={(e) => handleSpecChange(index, e)}
                                            placeholder="Value"
                                            className="p-2 border rounded-md w-full"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            specifications: prev.specifications.filter((_, i) => i !== index)
                                        }))}
                                        className="bg-red-500 text-white px-3 py-2 rounded-md h-fit hover:bg-red-600 transition-colors sm:w-24"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpecification}
                                className="bg-green-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-600 transition-colors w-full sm:w-auto"
                            >
                                Add Specification
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </form>

                    {loading && <LoadingSpinner />}
                </div>
            </div>
        )
    );
};

export default EditProduct;