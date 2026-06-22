import { useEffect, useState } from "react";
import Navbar from './Navbar.js'
import axios from "axios";
import "./styles/ActiveBorrower.css"; // Points to your styles folder

function ActiveBorrower() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");

        axios.get(
            "http://localhost:5000/admin/active-borrowers",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            // Guard clause to safely handle array data injection
            let data = Array.isArray(response.data?.data) ? response.data.data : [];
            setBorrowers(data);
        })
        .catch(error => {
            console.error("Error fetching active borrowers:", error);
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
                    <h3>Loading Active Borrowers...</h3>
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
            <div className="borrower-card-container shadow-look">
                
                <div className="borrower-header">
                    <h2>Total Active Borrowers</h2>
                    <p>Real-time log of administrative client asset holders</p>
                </div>

                <div className="table-responsive-wrapper">
                    <table className="dark-custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>#</th>
                                <th>Name</th>
                                <th>Email Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.length > 0 ? (
                                borrowers.map((borrower, index) => (
                                    <tr key={borrower._id || index}>
                                        <td className="index-column">{index + 1}</td>
                                        <td className="highlight-text">{borrower.name}</td>
                                        <td className="muted-text">{borrower.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-data-fallback">
                                        No Active Borrowers Found
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

export default ActiveBorrower;