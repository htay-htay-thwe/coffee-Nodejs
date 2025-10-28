const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("CakeCategories", CategorySchema)