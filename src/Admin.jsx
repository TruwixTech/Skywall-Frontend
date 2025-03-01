import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Components/AdminDashboardComponents/Sidebar'
import { jwtDecode } from 'jwt-decode'

function Admin() {
    const navigate = useNavigate()

    useEffect(() => {
        try {
            const token = localStorage.getItem("token"); // Ensure correct key
            if (token) {
                const decoded = jwtDecode(token);
                if (decoded.role !== 'Admin') {
                    navigate('/admin-login')
                }
            } else {
                navigate('/admin-login')
            }
        } catch (error) {
            navigate('/admin-login')
        }
    }, [])

    return (
        <>
            <div className='w-full h-auto flex'>
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default Admin