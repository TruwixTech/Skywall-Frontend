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
  const [userId, setUserId] = useState(null)

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

  async function fetchOrders() {
    try {
      setLoading(true)
      const response = await axios.post(`${backend}/order/list`, {
        pageNum: 1,
        pageSize: 20,
        filters: {
          user_id: userId
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
        setUserId(decodedToken?.userId)
        fetchOrders()
      }
    }
    else {
      navigate('/signin')
    }
  }, [userId])

  // Add these SVG icons at the top of your file
  const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );

  const FactoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  );

  const ArrowPathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );

  const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );

  const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );

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
                className="relative rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                {/* Order Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      Order # {order._id.slice(-8)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {convertUTCtoIST2(order.created_at)}
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Products List */}
                <div className="mb-4 space-y-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <img
                        src={product.product_id?.image?.[0] || "/placeholder.png"}
                        alt={product.product_id.name}
                        className="h-12 w-12 flex-shrink-0 rounded-md border object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {product.product_id.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          <span>Qty: {product.quantity}</span>
                          {product.total_warranty > 0 && (
                            <span className="ml-2">
                              <span className="mx-1">•</span>
                              <span className="font-medium text-blue-600">
                                {product.total_warranty >= 12
                                  ? `${(product.total_warranty / 12).toFixed(1)}Y`
                                  : `${product.total_warranty}M`}
                              </span> warranty
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics Details */}
                <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="font-medium text-gray-700">Logistics Details</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{order.dispatchCenter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FactoryIcon className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{order.originCenter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{order.returnCenter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span>{order.facilityCity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GlobeIcon className="h-4 w-4 text-gray-400" />
                      <span>{order.facilityState}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 border-t pt-4 text-sm">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total Amount:</span>
                    <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-gray-500">
                    <div className="truncate">Shipping: {order.shippingAddress}</div>
                    <div>Delivery: {order.expectedDelivery || 'To be confirmed'}</div>
                  </div>
                </div>

                {/* Cancel Button */}
                {order.status === PENDING && (
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setShowCancelConfirm(true);
                    }}
                    disabled={cancellingOrderId === order._id}
                    className={`mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors ${cancellingOrderId === order._id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                  >
                    {cancellingOrderId === order._id ? 'Processing...' : 'Cancel Order'}
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