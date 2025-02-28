import React from 'react';
const recentOrders = [
  { id: '#1245', customer: 'John Doe', date: '2024-02-15', status: 'Completed', amount: 299 },
  { id: '#1246', customer: 'Jane Smith', date: '2024-02-14', status: 'Pending', amount: 599 },
  { id: '#1247', customer: 'Mike Johnson', date: '2024-02-13', status: 'Processing', amount: 199 },
];

const StatCard = ({ title, value, trend, icon, color }) => (
  <div className={`p-6 rounded-lg shadow-sm ${color} text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        <span className="text-sm">{trend}</span>
      </div>
      <div className="text-4xl">
        {icon}
      </div>
    </div>
  </div>
);

function AdminDashboard() {
  return (
    <div className="min-h-screen w-full bg-gray-100 pt-5 lg:pt-8">
      <div className="flex w-full">
        {/* Main Content */}
        <div className="flex-1 p-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value="₹45,231"
              trend="↑ 20.1% from last month"
              icon="💰"
              color="bg-green-500"
            />
            <StatCard
              title="Total Orders"
              value="2,345"
              trend="↑ 15.2% from last month"
              icon="📦"
              color="bg-blue-500"
            />
            <StatCard
              title="Active Customers"
              value="1,234"
              trend="↓ 5.1% from last month"
              icon="👤"
              color="bg-purple-500"
            />
            <StatCard
              title="Avg. Order Value"
              value="₹123"
              trend="↑ 8.3% from last month"
              icon="📊"
              color="bg-orange-500"
            />
          </div>
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="pb-3 px-5">Order ID</th>
                    <th className="pb-3 px-5">Customer</th>
                    <th className="pb-3 px-5">Date</th>
                    <th className="pb-3 px-5">Status</th>
                    <th className="pb-3 px-5">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="py-4 px-5">{order.id}</td>
                      <td className='px-5'>{order.customer}</td>
                      <td className='px-5'>{order.date}</td>
                      <td className='px-5'>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='px-5'>${order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;