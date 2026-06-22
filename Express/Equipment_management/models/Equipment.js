const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
{
    equipmentName: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    serialNumber: {
        type: String,
        required: true,
        unique: true
    },

    availableQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["Available", "Maintenance", "Retired"],
        default: "Available"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Equipment", equipmentSchema);