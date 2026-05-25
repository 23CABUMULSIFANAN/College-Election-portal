import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {

    const isLoggedIn =
        localStorage.getItem("roll_no")

    if (!isLoggedIn) {

        return <Navigate to="/" />
    }

    return children
}