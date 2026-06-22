import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Home.css"; // Points to your specified Home.css filename
import { Link } from "react-router-dom";

function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalEquipment: 0,
        availableEquipment: 0,
        totalBorrowers: 0,
        activeBorrowings: 0,
        returnedItems: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");

        axios.get(
            "http://localhost:5000/admin/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            setDashboardData(response.data.data);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dark-loading-container">
                    <div className="dark-spinner"></div>
                    <h3>Loading Dashboard...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-block">
                <h2 className="dashboard-title">Admin Dashboard</h2>
                <p className="dashboard-subtitle">Overview metrics, inventory asset statuses, and operational telemetry indicators.</p>
            </div>

            <div className="dashboard-grid">
                
                <Link style={{ textDecoration: 'none' }} to="/admin-dashboard" className="card-wrapper-link">
                    <div className="dashboard-card border-blue">
                        <h3>Total Equipment Types</h3>
                        <p className="stat-number color-blue">{dashboardData.totalEquipment}</p>
                    </div>
                </Link>

                <div className="dashboard-card border-sky">
                    <h3>Equipment Available</h3>
                    <p className="stat-number color-sky">{dashboardData.availableEquipment}</p>
                </div>

                <Link style={{ textDecoration: 'none' }} to="/admin/active-borrowers" className="card-wrapper-link">
                    <div className="dashboard-card border-purple">
                        <h3>Total Borrowers</h3>
                        <p className="stat-number color-purple">{dashboardData.totalBorrowers}</p>
                    </div>
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/admin/active-borrowings" className="card-wrapper-link">
                    <div className="dashboard-card border-amber">
                        <h3>Active Borrowings</h3>
                        <p className="stat-number color-amber">{dashboardData.activeBorrowings}</p>
                    </div>
                </Link>

                <Link style={{ textDecoration: 'none' }} to="/admin/returned-items" className="card-wrapper-link">
                    <div className="dashboard-card border-emerald">
                        <h3>Returned Items</h3>
                        <p className="stat-number color-emerald">{dashboardData.returnedItems}</p>
                    </div>
                </Link>

            </div>
        </div>
    );
}

export default AdminDashboard;