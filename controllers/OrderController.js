const Orders = require("../models/Orders");
const Carts = require("../models/Carts");
const Users = require("../models/Users");

const OrderController = {
    createOrder: async (req, res) => {
        try {
            console.log(req.body);
            const { tableNo, items, total, userName } = req.body;
            await Orders.create({
                tableNo,
                total,
                items,
                userName
            });

            const itemIds = items.map(item => item._id);
            await Carts.deleteMany({ tableNo, _id: { $in: itemIds } });
            const order = await Orders.find({ tableNo: tableNo });
            return res.json(order);

        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createDirectOrder: async (req, res) => {
        try {
            console.log(req.body);
            const { tableNo, items, total, userName } = req.body;
            await Orders.create({
                tableNo,
                total,
                items,
                userName
            });

            const itemIds = items.map(item => item._id);
            await Carts.deleteMany({ tableNo, _id: { $in: itemIds } });
            const order = await Orders.find({ tableNo: tableNo });
            return res.json(order);

        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createDirectCakeOrder: async (req, res) => {
        try {
            console.log(req.body);
            const { tableNo, items, total, userName } = req.body;
            await Orders.create({
                tableNo,
                total,
                items,
                userName
            });

            const itemIds = items.map(item => item._id);
            await Carts.deleteMany({ tableNo, _id: { $in: itemIds } });
            const order = await Orders.find({ tableNo: tableNo });
            return res.json(order);

        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    getOrder: async (req, res) => {
        try {
            const { id } = req.params;

            const orders = await Orders.find({ tableNo: id });
            console.log(orders);
            return res.json(orders);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = 10;
            console.log(page);

            let totalCount = await Orders.find({ paidStatus: { $ne: "Paid" } }).countDocuments();
            let totalPageCount = Math.ceil(totalCount / limit);
            let dataLink = {
                previousPage: page == 1 ? false : true,
                nextPage: totalPageCount == page ? false : true,
                currentPage: page,
                loopLinks: []
            };

            for (i = 0; i < totalPageCount; i++) {
                let number = i + 1;
                dataLink.loopLinks.push({ loopNumber: number });
            }

            const orders = await Orders.find({ paidStatus: { $ne: "Paid" } })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            return res.json({ orders, dataLink });
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    clearOrders: async (req, res) => {
        try {
            const result = await Orders.deleteMany({});
            const or = await Orders.find();
            return res.json(or);
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    updateStatus: async (req, res) => {
        try {
            const { id, status } = req.body;

            await Orders.findByIdAndUpdate(
                id,
                { $set: { status } },
                { new: true }
            );
            const order = await Orders.find();
            return res.json(order);
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    updatePaid: async (req, res) => {
        try {
            const { id, paidStatus, status } = req.body;
            await Orders.findByIdAndUpdate(
                id,
                { $set: { paidStatus } },
                { $set: { status } },
                { new: true }
            );
            const order = await Orders.find();
            return res.json(order);
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    getHistoryOrder: async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = 5;

            const orderHistory = await Orders.aggregate([
                { $match: { paidStatus: "Paid" } },

                {
                    $addFields: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    }
                },

                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        totalRevenue: { $sum: { $toDouble: "$total" } },
                        orders: { $push: "$$ROOT" }
                    }
                },
                { $sort: { "_id.year": -1, "_id.month": -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ]);

            const totalCount = await Orders.aggregate([
                { $match: { paidStatus: "Paid" } },
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }
                    }
                },
                { $count: "count" }
            ]);

            const totalPageCount = Math.ceil((totalCount[0]?.count || 0) / limit);
            let dataLink = {
                previousPage: page == 1 ? false : true,
                nextPage: totalPageCount == page ? false : true,
                currentPage: page,
                loopLinks: Array.from({ length: totalPageCount }, (_, i) => ({
                    loopNumber: i + 1
                }))
            };

            return res.json({ orderHistory, dataLink, totalPageCount });

        } catch (err) {
            console.error("Failed to group orders by month:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }

    },
    getAllData: async (req, res) => {
        try {
            const [
                monthlyUsers,
                monthlyOrders,
                dailyOrders,
                mostSellingItems,
                radarData
            ] = await Promise.all([
                getUsersPerMonth(),
                getOrdersPerMonth(),
                getDailyOrders(),
                getMostSellingItems(),
                getRadarData()
            ]);
            res.json({ monthlyUsers, monthlyOrders, dailyOrders, mostSellingItems, radarData })
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
}

async function getUsersPerMonth() {
    const usersPerMonth = await Users.aggregate([
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
        { $project: { month: "$_id", users: "$count", _id: 0 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyUsers = monthNames.map(month => ({ month, users: 0 }));

    usersPerMonth.forEach(u => {
        monthlyUsers[u.month - 1].users = u.users;
    });

    return monthlyUsers;
}

async function getOrdersPerMonth() {
    const ordersPerMonth = await Orders.aggregate([
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
        { $project: { month: "$_id", orders: "$count", _id: 0 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyOrders = monthNames.map(month => ({ month, orders: 0 }));

    ordersPerMonth.forEach(u => {
        monthlyOrders[u.month - 1].orders = u.orders;
    });

    return monthlyOrders;
}

async function getDailyOrders() {
    const dailyOrdersFromDB = await Orders.aggregate([
        { $group: { _id: { $dayOfWeek: "$createdAt" }, orders: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
        { $project: { day: "$_id", orders: 1, _id: 0 } }
    ]);

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyOrders = weekDays.map(day => ({ day, orders: 0 }));

    dailyOrdersFromDB.forEach(d => {
        dailyOrders[d.day - 1].orders = d.orders;
    });

    return dailyOrders;
}

async function getMostSellingItems() {
    return await Orders.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", value: { $sum: { $toInt: "$items.quantity" } } } },
        { $sort: { value: -1 } },
        { $limit: 5 },
        { $project: { _id: 0, name: "$_id", value: 1 } }
    ]);
}

async function getRadarData() {
    return await Orders.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: { $ifNull: ["$items.kind", "Unknown"] },
                totalOrders: { $sum: { $toInt: "$items.quantity" } }
            }
        },
        { $project: { _id: 0, subject: "$_id", orders: "$totalOrders" } }
    ]);
}

module.exports = OrderController;