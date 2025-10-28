const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const TableNosSchema = new Schema({
    tableNo: {
        type: String,
        unique: true,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("TableNos", TableNosSchema)