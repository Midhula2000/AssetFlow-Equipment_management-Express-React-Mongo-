import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Dashboard.css"; // Imported the style sheet
import { Link } from "react-router-dom";
import Navbar from './Navbar.js'

function EquipmentList() {
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States for controlling the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

    useEffect(() => {
        function fetchEquipments() {
            const token = localStorage.getItem("Admintoken");
            axios.get("http://localhost:5000/list_equipment_api/", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                let data = Array.isArray(response.data) ? response.data : [];
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

    // Opens the modal wrapper and logs the ID to delete
    const triggerDeleteModal = (id) => {
        setSelectedEquipmentId(id);
        setIsModalOpen(true);
    };

    // Safely exits the modal view
    const closeDeleteModal = () => {
        setSelectedEquipmentId(null);
        setIsModalOpen(false);
    };

    // Executes backend API call ONLY after clicking "Confirm"
    const handleConfirmedDelete = () => {
        if (!selectedEquipmentId) return;

        axios.delete(`http://localhost:5000/delete_equipment_api/${selectedEquipmentId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }).then(response => {
            console.log(response.data);
            alert("Equipment deleted successfully!");
            setEquipments(prev => prev.filter(item => item._id !== selectedEquipmentId));
        }).catch(error => {
            console.error("Error deleting equipment:", error);
            alert("Failed to delete equipment.");
        }).finally(() => {
            closeDeleteModal();
        });
    };

    // Function to handle backend status updates
    const updateStatus = (id, newStatus) => {
    const token = localStorage.getItem("Admintoken");

    setEquipments(prev =>
        prev.map(item =>
            item._id === id
                ? { ...item, status: newStatus }
                : item
        )
    );

    axios.put(
        `http://localhost:5000/toggle_availability/${id}`,
        { status: newStatus },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .catch(error => {
        console.error(error);
    });
};

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <h3>Loading Equipment...</h3>
            </div>
        );
    }

    return (
        <div>
             <div> 
            <Navbar/>
            </div>
        /* The main outer wrapper page background layer */
        <div className="equipment-wrapper">

            <div className="action-row-container">
                <Link to="/admin/create" className="btn-create">
                    + Create Equipment
                </Link>
            </div>

            {/* equipment card wrapper component */}
            <div className="equipment-card">
                <div className="equipment-header">
                    <h2>Equipment Management</h2>
                    <p>View and toggle active network and lab inventory availability</p>
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
                                <th>Actions</th>
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
                                                <div className="status-container">
    <select
        value={equipment.status}
        onChange={(e) =>
            updateStatus(equipment._id, e.target.value)
        }
        className="status-select"
    >
        <option value="Available">Available</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Retired">Retired</option>
    </select>

   
</div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Link to={`/admin/edit/${equipment._id}`} className="btn-action btn-edit">
                                                        Edit
                                                    </Link>
                                                    <button className="btn-action btn-delete" onClick={() => triggerDeleteModal(equipment._id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center no-data">No equipment available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
</div>
            {/* ==========================================================================
               CONFIRMATION MODAL (Renders conditionally based on component state)
               ========================================================================== */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-alert-icon">⚠️</div>
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to permanently delete this asset record? This operation cannot be undone inside the database.</p>
                        
                        <div className="modal-actions">
                            <button type="button" className="btn-modal-cancel" onClick={closeDeleteModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn-modal-confirm" onClick={handleConfirmedDelete}>
                                Delete Registry
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EquipmentList;