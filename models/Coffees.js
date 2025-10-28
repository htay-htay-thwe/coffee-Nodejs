const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CoffeesSchema = new Schema({
    categoryId: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    price: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
}, { timestamps: true })

module.exports = mongoose.model("Coffees", CoffeesSchema)