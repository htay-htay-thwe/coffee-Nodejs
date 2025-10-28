const CakeCategories = require("../models/CakeCategories");
const Categories = require("../models/Categories");
const Coffees = require("../models/Coffees");
const fs = require("fs");
const path = require("path");

const CoffeeController = {
    create: async (req, res) => {
        try {
            const { categoryId, name, price, description, type } = req.body;
            const image = req.file ? req.file.filename : null;
            const coffee = await Coffees.create({
                categoryId,
                type,
                name,
                price,
                image,
                description
            });
            return res.json(coffee);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            console.log(req.body);
            const { id, categoryId, name, price, description, type } = req.body;
            const image = req.file ? req.file.filename : req.body.image;
            const updateData = {
                categoryId,
                name,
                price,
                description,
                type,
                image
            };
            const coffee = await Coffees.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );
            return res.json(coffee);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    get: async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = 10;

            const coffeeItem = await Coffees.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            let totalCount = await Coffees.find().countDocuments();
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


            return res.json({ coffeeItem, dataLink });
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    edit: async (req, res) => {
        try {
            const { id } = req.params;
            const coffeeItem = await Coffees.findOne({ _id: id });
            return res.json(coffeeItem);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const coffee = await Coffees.findOne(id);
            if (coffee.image) {
                const imagePath = path.join(__dirname, "uploads", coffee.image);
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Failed to delete image:", err);
                    else console.log("Image deleted:", coffee.image);
                });
            }
            await Coffees.findByIdAndDelete({ _id: id });
            const item = await Coffees.find();
            return res.json(item);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }
            const category = await Categories.create({ name });
            return res.json(category);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    createCakeCategory: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Name is required" });
            }
            const category = await CakeCategories.create({ name });
            return res.json(category);
        } catch (err) {
            console.error("Error creating category:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },
    getCategory: async (req, res) => {
        try {
            const categories = await Categories.find();
            return res.json(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errors: "Failed to fetch categories" });
        }
    },
    getCakeCategory: async (req, res) => {
        try {
            const categories = await CakeCategories.find();
            return res.json(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errors: "Failed to fetch categories" });
        }
    }

}

module.exports = CoffeeController;