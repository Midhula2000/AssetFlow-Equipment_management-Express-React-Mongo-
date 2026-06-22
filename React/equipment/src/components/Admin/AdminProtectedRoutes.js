import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function AdminProtectedRoutes({ children }) {
    const location = useLocation();

    const token = localStorage.getItem("Admintoken");
console.log(token)
    if (!token) {
        return (
            <Navigate to="/adminlogin" state={{ from: location }} replace />
        );
    }

    return children;
}

export default AdminProtectedRoutes;