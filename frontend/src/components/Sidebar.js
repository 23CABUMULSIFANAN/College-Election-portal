import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../style/Dashboard.css'

export default function Sidebar() {

    const navigate = useNavigate()
    const location = useLocation()

    const [open, setOpen] = useState(false)

    function handleNavigate(path) {
        navigate(path)
        setOpen(false)
    }

    function handleLogout() {
        localStorage.removeItem("roll_no")
        navigate("/")
    }

    return (
        <>
            {/* ── MOBILE NAVBAR ── */}
            <div className='mobile-nav'>
                <div className='nav-brand'>
                    <div className='nav-brand-icon'>🗳️</div>
                    <h2 className='mobile-logo'>Vote <span>Portal</span></h2>
                </div>

                <button
                    className='menu-btn'
                    onClick={() => setOpen(!open)}
                >
                    {open ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <>
                    <div
                        className='overlay'
                        onClick={() => setOpen(false)}
                    />
                    <div className='mobile-dropdown'>
                        <button
                            className={location.pathname === "/student" ? "active-link" : "sidebar-btn"}
                            onClick={() => handleNavigate("/student")}
                        >
                            🏠 Home
                        </button>

                        <button
                            className={location.pathname === "/about" ? "active-link" : "sidebar-btn"}
                            onClick={() => handleNavigate("/about")}
                        >
                            ℹ️ About
                        </button>

                        <button
                            className={location.pathname === "/results" ? "active-link" : "sidebar-btn"}
                            onClick={() => handleNavigate("/results")}
                        >
                            📊 Results
                        </button>

                        <button className='logout-btn' onClick={handleLogout}>
                            🚪 Logout
                        </button>
                        
                    </div>
                </>
            )}

            {/* ── DESKTOP NAVBAR (replaces sidebar) ── */}
            <div className='sidebar desktop-sidebar'>
                <div className='nav-brand'>
                    <div className='nav-brand-icon'>🗳️</div>
                    <h2 className='portal-title'>Vote <span>Portal</span></h2>
                </div>

                <div className='sidebar-links'>
                    <button
                        className={location.pathname === "/student" ? "active-link" : "sidebar-btn"}
                        onClick={() => navigate("/student")}
                    >
                        Home
                    </button>

                    <button
                        className={location.pathname === "/about" ? "active-link" : "sidebar-btn"}
                        onClick={() => navigate("/about")}
                    >
                        About
                    </button>

                    <button
                        className={location.pathname === "/results" ? "active-link" : "sidebar-btn"}
                        onClick={() => navigate("/results")}
                    >
                        Results
                    </button>
                </div>

                <button className='logout-btn sidebar-logout' onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </>
    )
}