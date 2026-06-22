import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/MyActiveBorrowings.css"; // Connects to your unified premium dark framework

function MyActiveBorrowings() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    function fetchTransactions() {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:5000/users/my-active-transactions", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            let data = response.data && response.data.data ? response.data.data : [];
            setTransactions(Array.isArray(data) ? data : []);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    function ReturnItem(transactionId) {
        const token = localStorage.getItem("token");
        
        axios.patch(`http://localhost:5000/users/return/${transactionId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error(error);
            alert(error.response?.data?.message || "Return action failed");
        })
        .finally(() => {
            fetchTransactions();
        });
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <h3>Synchronizing account balances...</h3>
            </div>
        );
    }

    return (
        <div className="equipment-wrapper">
            <div className="equipment-card">
                <div className="equipment-header">
                    <h2>My Active Borrowings</h2>
                    <p>Manage items currently assigned to you. Ensure to return equipment before their expiration date window.</p>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Equipment Name</th>
                                <th>Category</th>
                                <th>Serial Number</th>
                                <th>Quantity</th>
                                <th>Borrow Date</th>
                                <th>Expected Return Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(transaction => (
                                    <tr key={transaction._id}>
                                        <td className="fw-semibold">{transaction.equipment?.equipmentName || "N/A"}</td>
                                        <td>{transaction.equipment?.category || "N/A"}</td>
                                        <td className="text-muted">{transaction.equipment?.serialNumber || "N/A"}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>
                                            {transaction.borrowDate ? new Date(transaction.borrowDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td>
                                            {transaction.expectedReturnDate ? new Date(transaction.expectedReturnDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td>
                                            <span className="status-badge status-warn">
                                                Borrowed
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-action btn-return"
                                                onClick={() => ReturnItem(transaction._id)}
                                            >
                                                Return Item
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">
                                        You don't have any actively borrowed equipment items right now.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MyActiveBorrowings;