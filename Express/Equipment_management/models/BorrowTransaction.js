const mongoose = require("mongoose");

const borrowTransactionSchema = new mongoose.Schema(
{
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    borrowDate: {
        type: Date,
        required: true
    },

    expectedReturnDate: {
        type: Date,
        required: true
    },

    returnDate: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ["Borrowed", "Returned"],
        default: "Borrowed"
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model(
    "BorrowTransaction",
    borrowTransactionSchema
);