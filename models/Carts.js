const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartData = new Schema({
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
    price: {
        type: String,
        require: true
    },
    quantity: {
        type: String,
        require: true
    },

}, { timestamps: true })

module.exports = mongoose.model("Carts", CartData)