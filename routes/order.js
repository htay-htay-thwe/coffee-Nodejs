const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");
const OrderController = require("../controllers/OrderController");
const HandleValidationRequest = require("../validations/HandleValidation");
const { body } = require("express-validator");

router.get("/get/cart/:id/:userId", CartController.getCart);
router.get("/delete/cart/:id/:userId", CartController.deleteCart);
router.get("/get/item/:id", CartController.getItem);
router.post("/create/cart", [
    body("kind").notEmpty().withMessage("Please Choose Type!"),
], HandleValidationRequest, CartController.createCart);
router.post("/create", OrderController.createOrder);
router.post("/direct/create", [
    body('kind').notEmpty().withMessage('Please choose type!')
], HandleValidationRequest, OrderController.createDirectOrder);
router.post("/direct/create/cake", OrderController.createDirectCakeOrder);
router.post("/create/cart/cake", CartController.createCartCake);
router.get("/get/:id", OrderController.getOrder);
router.get("/all/get", OrderController.getAllOrders);
router.post("/delete", OrderController.clearOrders);
router.post("/update", OrderController.updateStatus);
router.post("/update/paid", OrderController.updatePaid);
router.get("/get/history/order", OrderController.getHistoryOrder);


router.get("/get/all/data", OrderController.getAllData);

module.exports = router;