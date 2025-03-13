import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { convertUTCtoIST2 } from '../../utils/TimeConverter';
import { toast } from 'react-toastify';

// Mock status colors - replace with your actual enum imports
const PENDING = 'Pending';
const SHIPPED = 'Shipped';
const DELIVERED = 'Delivered';
const CANCELLED = 'Cancelled';
 
const backend = import.meta.env.VITE_BACKEND;
 
const statusStyles = {
  [PENDING]: 'bg-yellow-100 text-yellow-800',
  [SHIPPED]: 'bg-blue-100 text-blue-800',
  [DELIVERED]: 'bg-green-100 text-green-800',
  [CANCELLED]: 'bg-red-100 text-red-800',
};
 
function MyOrders() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const CancelConfirmation = () => (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowCancelConfirm(false);
              setSelectedOrderId(null);
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Go Back
          </button>
          <button
            onClick={async () => {
              setShowCancelConfirm(false);
              if (selectedOrderId) {
                await handleCancelOrder(selectedOrderId);
              }
              setSelectedOrderId(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );


  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      setCancellingOrderId(orderId);
      const response = await axios.post(
        `${backend}/order/${orderId}/update`,
        { status: CANCELLED },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        }
      );

      if (response.data.status === 'Success') {
        fetchOrders();
        toast.success('Order cancelled successfully');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
      setLoading(false);
    }
  };

  async function fetchOrders(id) {
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/order/list`, {
        pageNum: 1,
        pageSize: 20,
        filters: {
          user_id: id
        }
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      })
      if (response.data.status === "Success") {
        setOrders(response.data.data.orderList)
        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'))
    if (token) {
      const decodedToken = jwtDecode(token)
      if (!decodedToken.userId) {
        navigate('/signin')
      } else {
        fetchOrders(decodedToken.userId)
      }
    }
    else {
      navigate('/signin')
    }
  }, [])
 
 
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">My Orders</h1>
        {
          loading && <LoadingSpinner />
        }
        {showCancelConfirm && <CancelConfirmation />}
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                {/* Order Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="truncate text-sm font-medium text-gray-500">
                    Order # {order._id}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
 
                {/* Products List */}
                <div className="mb-4 border-b border-t border-gray-200">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex-1 truncate pr-4">
                        <div className="font-medium text-gray-900">
                          {product.product_id.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {product.quantity}
                          {product.total_warranty && (
                            <span>
                              {' • Warranty: '}
                              {product.total_warranty >= 12
                                ? `${(product.total_warranty / 12).toFixed(1)} Years`
                                : `${product.total_warranty} Months`}
                              {/* {format(new Date(product.warranty_expiry_date), 'MMM dd, yyyy')} */}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
 
                {/* Order Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹ {order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-500">
                    <div>Shipping to: {order.shippingAddress}</div>
                    <div>
                      Expected Delivery:{' '}
                      {order.expectedDelivery || 'N/A'}
                      {/* {format(new Date(order.expectedDelivery), 'MMM dd, yyyy')} */}
                    </div>
                    <div>
                      Order Date:{' '}
                      {convertUTCtoIST2(order.created_at)}
                      {/* {format(new Date(order.created_at), 'MMM dd, yyyy')} */}
                    </div>
                  </div>
                </div>
                {order.status === PENDING && (
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setShowCancelConfirm(true);
                    }}
                    disabled={cancellingOrderId === order._id}
                    className={`rounded-xl py-2.5 mt-6 text-base w-full font-medium ${cancellingOrderId === order._id
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                  >
                    {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
export default MyOrders;