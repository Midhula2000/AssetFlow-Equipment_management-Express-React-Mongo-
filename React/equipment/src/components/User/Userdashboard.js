import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Userdashboard.css"; // Imported the style sheet
import { Link } from "react-router-dom";

function Userdashboard() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
   const [modalOpen, setModalOpen] = useState(false);
   const [selectedEquipment, setSelectedEquipment] = useState(null);
   const [borrowForm, setBorrowForm] = useState({
    quantity: "",
    expectedReturnDate: ""
    
});
    useEffect(() => {
        function fetchEquipments() {
            const token = localStorage.getItem("token");
            axios.get("http://localhost:5000/users/equipments", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                let data = Array.isArray(response.data.data)
        ? response.data.data
        : [];
                  console.log(data)
                setEquipments(data);
              
            })
            .catch(error => {
                console.error("Error fetching equipments:", error);
            })
            .finally(() => {
                setLoading(false);
            });
        }
        fetchEquipments();
    }, []);


    function Borrowitem(equipment) {
    openModal(equipment);
}
   function openModal(equipment) {

    setSelectedEquipment(equipment);

    setBorrowForm({
        quantity: "",
        expectedReturnDate: ""
    });

    setModalOpen(true);
}

function handleChange(e) {

    setBorrowForm({
        ...borrowForm,
        [e.target.name]: e.target.value
    });

}



function submitBorrow(e) {

    e.preventDefault();

    const token = localStorage.getItem("token");

    axios.post(
        "http://localhost:5000/users/borrow",
        {
            equipmentId: selectedEquipment._id,
            quantity: borrowForm.quantity,
            expectedReturnDate: borrowForm.expectedReturnDate
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then(response => {

        alert("Equipment borrowed successfully");

        setModalOpen(false);

    })
    .catch(error => {

        console.error(error);

        alert(
            error.response?.data?.message ||
            "Borrow failed"
        );

    });

}

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <h3>Loading Equipment...</h3>
            </div>
        );
    }

    return (
        <div className="equipment-wrapper">
            <div className="action-row-container">
              
            </div>
            <div className="action-row-container">
            <Link to="/my-active-borrowings" className="btn btn-active-borrowings">
                View My Active Borrowings
            </Link>
            </div>
            <div className="equipment-card">
                <div className="equipment-header">
                    <h2>Equipment list</h2>
                    
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Serial Number</th>
                                <th>Available Qty</th>
                                <th>Availability</th>
                                <th>Action</th>
                             
                                
                            </tr>
                        </thead>
                        <tbody>
                            {equipments.length > 0 ? (
                                equipments.map((equipment) => {
                                    const isAvailable = String(equipment.status).toLowerCase() === 'available' || String(equipment.status).toLowerCase() === 'active';
                                    
                                    return (
                                        <tr key={equipment._id}>
                                            <td className="fw-semibold">{equipment.equipmentName}</td>
                                            <td>{equipment.category}</td>
                                            <td className="text-muted">{equipment.serialNumber}</td>
                                            <td>{equipment.availableQuantity}</td>
                                            <td>
                                                <div >
                                                    <span className={`status-text-label ${isAvailable ? 'text-good' : 'text-warn'}`}>
                                                        {equipment.availability}
                                                    </span>
                                                   
                                                </div>
                                            </td>
                                          <button className="btn btn-borrow" onClick={() => Borrowitem(equipment)}>
    Borrow
</button>
                                            
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center no-data">No equipment available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
    modalOpen && (

        <div className="modal-overlay">

            <div className="borrow-modal">

                <h3>Borrow Equipment</h3>

                <form onSubmit={submitBorrow}>

                    <div className="mb-3">

                        <label>Equipment Name</label>

                        <input
                            type="text"
                            value={selectedEquipment?.equipmentName || ""}
                            readOnly
                        />

                    </div>

                    <div className="mb-3">

                        <label>Available Quantity</label>

                        <input
                            type="text"
                            value={selectedEquipment?.availableQuantity || ""}
                            readOnly
                        />

                    </div>

                    <div className="mb-3">

                        <label>Quantity Needed</label>

                        <input
                            type="number"
                            name="quantity"
                            value={borrowForm.quantity}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label>Expected Return Date</label>

                        <input
                            type="date"
                            name="expectedReturnDate"
                            value={borrowForm.expectedReturnDate}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="modal-buttons">

                        <button type="submit">
                            Confirm Borrow
                        </button>

                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )
}
        </div>
    );
}

export default Userdashboard;