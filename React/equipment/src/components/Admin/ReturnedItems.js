import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/ReturnItems.css"; // Links to your specified styles folder
import Navbar from './Navbar.js'


function ReturnedItems() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");

        axios.get(
            "http://localhost:5000/admin/transactions/returned",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            setTransactions(response.data.data);
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
            <div className="dark-theme-wrapper">
                <div className="dark-loading-container">
                    <div className="dark-spinner"></div>
                    <h3>Loading Returned Items...</h3>
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
            <div className="returned-card-container card-shadow">
                
                <div className="returned-header-row">
                    <div className="header-text-block">
                        <h2>Returned Items</h2>
                        <p>Historical audit trail of all assets cleared and returned to stock</p>
                    </div>
                    <span className="total-badge-success">
                        Total Returned: {transactions.length}
                    </span>
                </div>

                <div className="table-scroll-area">
                    <table className="returned-dark-table">
                        <thead>
                            <tr>
                                <th>Borrower</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Equipment</th>
                                <th>Category</th>
                                <th className="text-center">Qty</th>
                                <th>Borrow Date</th>
                                <th>Return Date</th>
                                <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(transaction => (
                                    <tr key={transaction._id}>
                                        <td className="highlight-text">{transaction.borrower?.name}</td>
                                        <td className="slate-light-text">{transaction.borrower?.email}</td>
                                        <td>{transaction.borrower?.department}</td>
                                        <td className="equipment-name-cell">{transaction.equipment?.equipmentName}</td>
                                        <td>
                                            <span className="category-inline-tag">
                                                {transaction.equipment?.category}
                                            </span>
                                        </td>
                                        <td className="text-center bold-qty">{transaction.quantity}</td>
                                        <td className="date-cell">
                                            {new Date(transaction.borrowDate).toLocaleDateString()}
                                        </td>
                                        <td className="date-cell return-date-highlight">
                                            {transaction.returnDate
                                                ? new Date(transaction.returnDate).toLocaleDateString()
                                                : "-"
                                            }
                                        </td>
                                        <td className="text-center">
                                            <span className="status-pill-success">
                                                Returned
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="empty-table-fallback">
                                        No Returned Items Found
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

export default ReturnedItems;