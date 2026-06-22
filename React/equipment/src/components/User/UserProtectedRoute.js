import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function UserProtectedRoute({ children }) {
    const location = useLocation();

    const token = localStorage.getItem("token");
console.log(token)
    if (!token) {
        return (
            <Navigate to="/user/login" state={{ from: location }} replace />
        );
    }

    return children;
}

export default UserProtectedRoute;