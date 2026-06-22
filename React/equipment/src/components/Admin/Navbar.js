import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./styles/Navbar.css"; // Reusing your main dashboard stylesheet

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Helper to keep paths tidy in the JSX code below
    const routes = [
        {path: "/home" , label: "Home"},
        { path: "/admin-dashboard", label: "Dashboard" },
        { path: "/admin/transactions", label: "Ledger Logs" },
        { path: "/admin/active-borrowings", label: "Active Borrowings" },
        { path: "/admin/returned-items", label: "Returned Items" },
        { path: "/admin/active-borrowers", label: "Active Borrowers" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("Admintoken");
        
        window.location.href = "/adminlogin"; // Redirect out to your login terminal
    };

    return (
        <nav className="admin-navbar">
            <div className="nav-container">
                {/* Brand Identity / Logo */}
                <div className="nav-brand">
                    <span className="brand-icon">🛡️</span>
                    <span className="brand-text">Admin<span className="brand-accent">Core</span></span>
                </div>

                {/* Mobile Hamburger Toggle Toggle Button */}
                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span className={`bar ${isOpen ? "open" : ""}`}></span>
                    <span className={`bar ${isOpen ? "open" : ""}`}></span>
                    <span className={`bar ${isOpen ? "open" : ""}`}></span>
                </button>

                {/* Navigation Links Grid Links Grid */}
                <div className={`nav-menu ${isOpen ? "is-active" : ""}`}>
                    {routes.map((route) => (
                        <NavLink 
                            key={route.path} 
                            to={route.path} 
                            className="nav-link"
                            onClick={() => setIsOpen(false)} // Closes mobile menu drawer on click
                        >
                            {route.label}
                        </NavLink>
                    ))}
                    
                    {/* Integrated Logout Option */}
                    <button onClick={handleLogout} className="btn-nav-logout">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;