import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {

    const token = localStorage.getItem('token');

    if (!token) {

        // Not logged in
        return <Navigate to="/login" replace />;

    }

    try {

        const decoded = jwtDecode(token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];

        // If specific roles are required, check if user has one of them

        if (allowedRoles && allowedRoles.length > 0) {

            if (!allowedRoles.includes(userRole)) {

                // User logged in but unauthorized for this page
                // Redirect to their appropriate dashboard or home

                return <Navigate to="/" replace />;

            }
        }

        // Authorized
        return children;

    } catch (error) {

        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
        
    }
};

export default ProtectedRoute;
