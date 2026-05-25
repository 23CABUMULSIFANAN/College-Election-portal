import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../style/Dashboard.css'

export default function AdminSidebar() {

    const navigate = useNavigate()
    const location = useLocation()

    const [open, setOpen] = useState(false)

    function handleNavigate(path) {
        navigate(path)
        setOpen(false)
    }

    function handleLogout() {

        localStorage.removeItem("token")
        localStorage.removeItem("role")

        navigate("/admin-login")
    }

    return (
        <>
            {/* MOBILE NAV */}
            <div className='mobile-nav'>

                <div className='nav-brand'>
                    <div className='nav-brand-icon'>🛠️</div>
                    <h2 className='mobile-logo'>
                        Admin <span>Panel</span>
                    </h2>
                </div>

                <button
                    className='menu-btn'
                    onClick={() => setOpen(!open)}
                >
                    {open ? '✕' : '☰'}
                </button>

            </div>

            {/* MOBILE DROPDOWN */}
            {open && (
                <>
                    <div
                        className='overlay'
                        onClick={() => setOpen(false)}
                    />

                    <div className='mobile-dropdown'>

                        <button
                            className={
                                location.pathname === "/admin-dashboard"
                                ? "active-link"
                                : "sidebar-btn"
                            }
                            onClick={() => handleNavigate("/admin-dashboard")}
                        >
                            📊 Dashboard
                        </button>

                        <button
                            className='sidebar-btn'
                            onClick={() => handleNavigate("/results")}
                        >
                            🗳️ Results
                        </button>
                        <button
                            className='sidebar-btn'
                            onClick={() => handleNavigate("/admin-candidates")}
                        >
                            Candidates
                        </button>

                        <button
                            className='logout-btn'
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>

                    </div>
                </>
            )}

            {/* DESKTOP */}
            <div className='sidebar desktop-sidebar'>

                <div className='nav-brand'>
                    <div className='nav-brand-icon'>🛠️</div>
                    <h2 className='portal-title'>
                        Admin <span>Panel</span>
                    </h2>
                </div>

                <div className='sidebar-links'>

                    <button
                        className={
                            location.pathname === "/admindashboard"
                            ? "active-link"
                            : "sidebar-btn"
                        }
                        onClick={() => navigate("/admin-dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className='sidebar-btn'
                        onClick={() => navigate("/admin-results")}
                    >
                        Results
                    </button>
                    <button className='sidebar-btn'
    onClick={() => navigate('/admin-candidates')}
>
    Candidates
</button>

                </div>

                <button
                    className='logout-btn sidebar-logout'
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>
        </>
    )
}