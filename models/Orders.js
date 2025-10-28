const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    tableNo: {
        type: String,
        required: true
    },
    items: [
        {
            userId: {
                type: String,
                require: true
            },
            tableNo: {
                type: String,
                require: true
            },
            itemId: {
                type: String,
                require: true
            },
            kind: {
                type: String,
                require: false
            },
            name: {
                type: String,
                require: true
            },
            image: {
                type: String,
                require: true
            },
            price: {
                type: String,
                require: true
            },
            quantity: {
                type: String,
                require: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["Pending", "Preparing", "Finished"],
        default: "Pending"
    },
    userName: {
        type: String,
        require: true
    },
    paidStatus: {
        type: String,
        enum: ["Unpaid", "Paid"],
        default: "Unpaid"
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Create Model
module.exports = mongoose.model("Orders", orderSchema);


