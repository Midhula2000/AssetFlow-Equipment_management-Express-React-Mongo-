import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from './Navbar.js'


function MyActiveBorrowings() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchTransactions();

    }, []);

    function fetchTransactions() {

        const token = localStorage.getItem("token");

        axios.get(
            "http://localhost:5000/users/my-active-transactions",
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

    }

    function ReturnItem(transactionId) {

        const token = localStorage.getItem("token");
        axios.patch(
            `http://localhost:5000/users/return/${transactionId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            alert(response.data.message);
        })
        .catch(error => {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Return failed"
            );
        })
        .finally(() => {
            fetchTransactions();
        });

    }


    if (loading) {
        return <h3>Loading...</h3>;
    }

    return (
        <div>
 <div> 
            <Navbar/>
            </div>
       
        <div className="container mt-4">

            <h2 className="mb-4">
                My Active Borrowings
            </h2>

            <table className="table table-bordered table-striped">

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

                    {
                        transactions.length > 0 ? (

                            transactions.map(transaction => (

                                <tr key={transaction._id}>

                                    <td>
                                        {transaction.equipment?.equipmentName}
                                    </td>

                                    <td>
                                        {transaction.equipment?.category}
                                    </td>

                                    <td>
                                        {transaction.equipment?.serialNumber}
                                    </td>

                                    <td>
                                        {transaction.quantity}
                                    </td>

                                    <td>
                                        {
                                            new Date(
                                                transaction.borrowDate
                                            ).toLocaleDateString()
                                        }
                                    </td>

                                    <td>
                                        {
                                            new Date(
                                                transaction.expectedReturnDate
                                            ).toLocaleDateString()
                                        }
                                    </td>

                                    <td>
                                        <span className="badge bg-warning text-dark">
                                            Borrowed
                                        </span>
                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => ReturnItem(transaction._id)}
                                        >
                                            Return
                                        </button>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center"
                                >
                                    No Active Borrowings Found
                                </td>

                            </tr>

                        )
                    }

                </tbody>

            </table>

        </div>
        </div>
    );
}

export default MyActiveBorrowings;