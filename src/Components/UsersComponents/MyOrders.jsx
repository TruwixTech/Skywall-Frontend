import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { convertUTCtoIST2 } from '../../utils/TimeConverter';


// Mock status colors - replace with your actual enum imports
const PENDING = 'Pending';
const COMPLETED = 'Completed';
const CANCELLED = 'Cancelled';

const backend = import.meta.env.VITE_BACKEND;

const statusStyles = {
  [PENDING]: 'bg-yellow-100 text-yellow-800',
  [COMPLETED]: 'bg-green-100 text-green-800',
  [CANCELLED]: 'bg-red-100 text-red-800',
};

function MyOrders() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])


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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;