const Carts = require("../models/Carts");
const Coffees = require("../models/Coffees");

const CartController = {
    getItem: async (req, res) => {
        try {
            const { id } = req.params;
            const items = await Coffees.findOne({ _id: id });
            return res.json(items);
        } catch (err) {
            console.error("Error getting cart:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    deleteCart: async (req, res) => {
        try {
            const { id, userId } = req.params;
            await Carts.findByIdAndDelete({ _id: id, userId: userId });
            const item = await Coffees.find();
            return res.json(item);
        } catch (err) {
            console.error("Error getting cart:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    getCart: async (req, res) => {
        try {
            const { id, userId } = req.params;
            const carts = await Carts.find({ tableNo: id, userId: userId });
            console.log(carts);
            const cartWithNames = await Promise.all(
                carts.map(async (item) => {
                    const coffee = await Coffees.findById(item.itemId).select("name image");
                    return {
                        _id: item._id,
                        userId: item.userId,
                        tableNo: item.tableNo,
                        itemId: item.itemId,
                        name: coffee ? coffee?.name : null,
                        image: coffee ? coffee?.image : null,
                        kind: item.kind,
                        price: Number(item.price),
                        quantity: Number(item.quantity)
                    };
                })
            );
            return res.json(cartWithNames);
        } catch (err) {
            console.error("Error getting cart:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createCart: async (req, res) => {
        try {
            const { userId, itemId, tableNo, kind, quantity, price } = req.body;
            const cart = await Carts.create({
                userId,
                itemId,
                kind,
                tableNo,
                quantity,
                price
            });
            return res.json(cart);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createCartCake: async (req, res) => {
        try {
            const { userId, itemId, tableNo, quantity, price } = req.body;
            const cart = await Carts.create({
                userId,
                itemId,
                tableNo,
                quantity,
                price
            });
            return res.json(cart);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
}

module.exports = CartController;