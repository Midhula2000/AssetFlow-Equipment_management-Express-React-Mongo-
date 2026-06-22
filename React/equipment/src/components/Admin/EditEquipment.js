import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./styles/Equipment.css"; // Points to your specified folder path
import Navbar from './Navbar.js'


function EditEquipment() {
    const navigate = useNavigate();
    const { id } = useParams(); // Grabs the URL ID

    const [formData, setFormData] = useState({
        equipmentName: "",
        category: "",
        
availableQuantity
: "",
        serialNumber: "",
        status: "Available"
    });
    const [loading, setLoading] = useState(true); // Start as true to show loader while fetching

    useEffect(() => {
        const token = localStorage.getItem("Admintoken");
        setLoading(true);

        axios.get(`http://localhost:5000/get_equipment_api/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (response.data) {   
                console.log("Fetched equipment data:", response.data); 
                setFormData({
                    equipmentName: response.data.equipmentName || "",
                    category: response.data.category || "",
                    availableQuantity: response.data.availableQuantity || "",
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
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        axios.put(`http://localhost:5000/update_equipment_api/${id}`, formData, { 
            headers: { Authorization: `Bearer ${token}` } 
        })
        .then(response => {
            console.log(response.data);
            alert("Equipment updated successfully!");
            navigate('/admin-dashboard');
        })
        .catch(error => {
            console.error("Error updating equipment:", error);
            alert("Failed to update equipment.");
        });
    };

    if (loading) {
        return (
            <div className="equipment-form-wrapper">
                <div className="form-loading-container">
                    <div className="form-spinner"></div>
                    <p>Loading asset specifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
        <div className="equipment-form-wrapper">
            <div className="equipment-form-card">
                <h2>Modify Equipment</h2>
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
                            value={formData.availableQuantity}
                            onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
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

                    {/* Form Actions */}
                    <div className="form-actions full-width">
                        <button type="button" className="btn-cancel" onClick={() => navigate('/admin-dashboard')}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
}

export default EditEquipment;