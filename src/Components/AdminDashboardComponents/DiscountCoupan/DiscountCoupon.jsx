import React, { useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const DiscountCoupon = () => {
  // Fake Coupons Data
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SAVE10", discount: 10, expiry: "2025-03-15", status: "Active" },
    { id: 2, code: "WELCOME20", discount: 20, expiry: "2025-04-01", status: "Active" },
    { id: 3, code: "FESTIVE30", discount: 30, expiry: "2024-02-28", status: "Expired" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiry: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  // Handle Coupon Submission
  const handleCreateCoupon = (e) => {
    e.preventDefault();

    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) {
      toast.error("Please fill all fields!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (newCoupon.expiry < today) {
      toast.error("Expiry date cannot be in the past!");
      return;
    }

    const newCouponData = {
      id: coupons.length + 1,
      code: newCoupon.code.toUpperCase(),
      discount: parseInt(newCoupon.discount),
      expiry: newCoupon.expiry,
      status: "Active",
    };

    setCoupons([...coupons, newCouponData]);
    toast.success("Coupon Created Successfully!");
    setShowModal(false);
    setNewCoupon({ code: "", discount: "", expiry: "" });
  };

  return (
    <div className="px-5 w-full py-14">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold lg:text-4xl">Coupons</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <IoAdd size={20} />
          Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 border">Coupon Code</th>
              <th className="p-3 border">Discount (%)</th>
              <th className="p-3 border">Expiry Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons
              .filter((coupon) => coupon.status !== "Expired")
              .map((coupon) => (
                <tr key={coupon.id} className="border-b text-gray-600">
                  <td className="p-3 border font-semibold">{coupon.code}</td>
                  <td className="p-3 border">{coupon.discount}%</td>
                  <td className="p-3 border">{coupon.expiry}</td>
                  <td className={`p-3 border font-semibold ${coupon.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                    {coupon.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-red-600" onClick={() => setShowModal(false)}>
              <IoClose size={22} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Create Coupon</h2>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  type="text"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter coupon code"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={newCoupon.discount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter discount percentage"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  value={newCoupon.expiry}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  min={new Date().toISOString().split("T")[0]} // Restricts past dates
                />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCoupon;
