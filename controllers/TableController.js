
const tables = require("../models/TableNos");

const TableController = {
    createTable: async (req, res) => {
        try {
            const { tableNo } = req.body;
            let table = await tables.findOne({ tableNo });

            if (!table) {
                table = await tables.create({ tableNo });
            }
            res.json(table);
            return res.json(table);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
}
module.exports = TableController;