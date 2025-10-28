const express = require("express")
const router = express.Router();
const CoffeeController = require("../controllers/CoffeeController")
const TableController = require("../controllers/TableController")
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/create", upload.single("image"), CoffeeController.create)
router.get("/get", CoffeeController.get)
router.get("/edit/:id", CoffeeController.edit)
router.post("/update", upload.single("image"), CoffeeController.update)
router.get("/delete/:id", CoffeeController.delete)
router.post("/category", CoffeeController.createCategory)
router.post("/cake/category", CoffeeController.createCakeCategory)
router.get("/get/category", CoffeeController.getCategory)
router.get("/get/cake/category", CoffeeController.getCakeCategory)

router.post("/create/table", TableController.createTable)


module.exports = router;