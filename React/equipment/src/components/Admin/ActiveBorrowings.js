import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ActiveBorrowings.css"; // Points to your specified styles folder
import Navbar from './Navbar.js'


function ActiveBorrowings() {
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");

        axios.get(
            "http://localhost:5000/admin/transactions/active",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            let data = Array.isArray(response.data?.data) ? response.data.data : [];
            setBorrowings(data);
        })
        .catch(error => {
            console.error("Error fetching active borrowings:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="dark-theme-wrapper">
                <div className="dark-loading-container">
                    <div className="dark-spinner"></div>
                    <h3>Loading Active Transactions...</h3>
                </div>
            </div>
        );
    }

    return (

        <div>
             <div> 
            <Navbar/>
            </div>
        <div className="dark-theme-wrapper">
            <div className="borrowings-card-container card-shadow">
                
                <div className="borrowings-header-row">
                    <div className="header-text-block">
                        <h2>Active Borrowings</h2>
                        <p>Comprehensive overview of equipment currently checked out by users</p>
                    </div>
                    <span className="total-badge">
                        Total Active: {borrowings.length}
                    </span>
                </div>

                <div className="table-scroll-area">
                    <table className="borrowings-dark-table">
                        <thead>
                            <tr>
                                <th>Borrower</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Equipment</th>
                                <th>Category</th>
                                <th className="text-center">Qty</th>
                                <th>Borrow Date</th>
                                <th>Expected Return</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings.length > 0 ? (
                                borrowings.map(transaction => (
                                    <tr key={transaction._id}>
                                        <td className="highlight-blue-text">{transaction.borrower?.name || "N/A"}</td>
                                        <td className="slate-light-text">{transaction.borrower?.email || "N/A"}</td>
                                        <td>{transaction.borrower?.department || "N/A"}</td>
                                        <td className="equipment-name-cell">{transaction.equipment?.equipmentName || "N/A"}</td>
                                        <td>
                                            <span className="category-inline-tag">
                                                {transaction.equipment?.category || "N/A"}
                                            </span>
                                        </td>
                                        <td className="text-center bold-qty">{transaction.quantity}</td>
                                        <td className="date-cell">
                                            {transaction.borrowDate ? new Date(transaction.borrowDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="date-cell expected-date">
                                            {transaction.expectedReturnDate ? new Date(transaction.expectedReturnDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="text-center">
                                            <span className="status-pill-warning">
                                                Borrowed
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="empty-table-fallback">
                                        No Active Borrowings Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        </div>
    );
}

export default ActiveBorrowings;