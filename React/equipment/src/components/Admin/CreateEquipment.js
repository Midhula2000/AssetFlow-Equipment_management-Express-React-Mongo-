import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./styles/Create.css"; // Correctly matches your Create.css filename
import Navbar from './Navbar.js'



function CreateEquipment({ isEditMode = false }) {
    const navigate = useNavigate();
    const { id } = useParams(); // Grabs the URL ID if in edit mode

    const [formData, setFormData] = useState({
        equipmentName: "",
        category: "",
        available_quantity: "",
        serialNumber: "",
        status: "Available"
    });
    const [loading, setLoading] = useState(false);

    // Fetch existing data if we are in Edit Mode
    useEffect(() => {
        if (isEditMode && id) {
            const token = localStorage.getItem("Admintoken");
            setLoading(true);
            axios.get(`http://localhost:5000/get_equipment_api/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data) {
                    setFormData({
                        equipmentName: response.data.equipmentName || "",
                        category: response.data.category || "",
                        available_quantity: response.data.available_quantity || "",
                        serialNumber: response.data.serialNumber || "",
                        status: response.data.status || "Available"
                    });
                }
            })
            .catch(error => {
                console.error("Error fetching equipment details:", error);
                alert("Failed to load equipment data.");
            })
            .finally(() => setLoading(false));
        }
    }, [isEditMode, id]);

    // Combined submit handler for Create and Edit workflows
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const apiUrl = isEditMode 
            ? `http://localhost:5000/update_equipment_api/${id}`
            : "http://localhost:5000/create_equipment_api";
        
        const apiMethod = isEditMode ? axios.put : axios.post;

        apiMethod(apiUrl, formData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                alert(`Equipment ${isEditMode ? "updated" : "created"} successfully!`);
                navigate('/admin-dashboard');
            })
            .catch(error => {
                console.error("Form transmission error:", error);
                alert("Action failed. Please check your fields and try again.");
            });
    };

    if (loading) {
        return (
            <div className="equipment-form-wrapper">
                <div className="dark-loading-container">
                    <div className="dark-spinner"></div>
                    <h3>Loading asset data...</h3>
                </div>
            </div>
        );
    }

    return (
        <div>
             <div> 
            <Navbar/>
            </div>
        <div className="equipment-form-wrapper">
            <div className="equipment-form-card card-shadow">
                <h2>{isEditMode ? "Modify Equipment" : "Create New Equipment"}</h2>
                <p className="form-subtitle">Fill in the fields below to update your inventory database registry.</p>
                
                <form onSubmit={handleSubmit} className="responsive-form-layout">
                    
                    {/* Equipment Name */}
                    <div className="form-group full-width">
                        <label>Equipment Name</label>
                        <input 
                            type="text"
                            value={formData.equipmentName}
                            onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                            placeholder="e.g., Enterprise Core Router"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Category</label>
                        <input 
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Enter category"
                            required
                        />
                    </div>

                    {/* Serial Number */}
                    <div className="form-group">
                        <label>Serial Number</label>
                        <input 
                            type="text"
                            value={formData.serialNumber}
                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            placeholder="Enter serial number"
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div className="form-group">
                        <label>Quantity</label>
                        <input 
                            type="number"
                            min="0"
                            value={formData.available_quantity}
                            onChange={(e) => setFormData({ ...formData, available_quantity: e.target.value })}
                            placeholder="Enter available quantity"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    {/* Form Action Buttons Row */}
                    <div className="form-actions full-width">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/admin-dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {isEditMode ? "Save Changes" : "Submit Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default CreateEquipment;