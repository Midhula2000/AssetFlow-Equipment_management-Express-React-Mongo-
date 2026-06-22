import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ViewAllTransactions.css"; // Uses your centralized theme sheet
import Navbar from './Navbar.js'


function TransactionList() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");

        axios.get("http://localhost:5000/admin/transactions", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // Added array type fallback safety check
            let data = response.data && response.data.data ? response.data.data : [];
            setTransactions(Array.isArray(data) ? data : []);
        })
        .catch(error => {
            console.error("Error fetching transactions:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <h3>Loading Ledger Transactions...</h3>
            </div>
        );
    }

    return (
        <div>
             <div> 
            <Navbar/>
            </div>
       
        <div className="equipment-wrapper">
            {/* Kept header INSIDE the card matching our UX hierarchy discussion */}
            <div className="equipment-card">
                <div className="equipment-header">
                    <h2>All Borrow Transactions</h2>
                    <p>Track global asset allocation, user distribution, and critical expected return windows</p>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Borrower Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Equipment</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Borrow Date</th>
                                <th>Expected Return</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(transaction => {
                                    // Sanitize status text string safely for css tracking hooks
                                    const txStatus = String(transaction.status).toLowerCase();
                                    const isPending = txStatus === 'pending' || txStatus === 'borrowed';

                                    return (
                                        <tr key={transaction._id}>
                                            <td className="fw-semibold">{transaction.borrower?.name || "N/A"}</td>
                                            <td className="text-muted">{transaction.borrower?.email || "N/A"}</td>
                                            <td>{transaction.borrower?.department || "N/A"}</td>
                                            <td className="fw-semibold text-sky">{transaction.equipment?.equipmentName || "N/A"}</td>
                                            <td>{transaction.equipment?.category || "N/A"}</td>
                                            <td>{transaction.quantity}</td>
                                            <td>
                                                {transaction.borrowDate ? new Date(transaction.borrowDate).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td>
                                                {transaction.expectedReturnDate ? new Date(transaction.expectedReturnDate).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td>
                                                {/* Re-using our status design system tokens */}
                                                <span className={`status-badge ${isPending ? 'status-warn' : 'status-good'}`}>
                                                    {transaction.status || "Unknown"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center no-data">No transactions found in system logs.</td>
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

export default TransactionList;