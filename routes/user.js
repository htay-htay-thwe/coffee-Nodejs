const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const HandleValidationRequest = require("../validations/HandleValidation");
const UserController = require('../controllers/UserController')

const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
        .notEmpty().withMessage("ConfirmPassword is required")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
], HandleValidationRequest, UserController.register);

router.post("/login", [
    body("email").notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], HandleValidationRequest, UserController.login);

router.post('/logout', UserController.logout);
router.post('/delete', UserController.clearUsers);
router.get('/get', UserController.getUsers);
router.post('/update/profile', upload.single("image"), UserController.updateProfile);
router.get('/delete/:id', UserController.deleteUser);
router.get('/auth/google', UserController.authGoogle);
router.post('/image', upload.single("image"), UserController.updateImage);
router.post('/change/password', [
    body("currentPassword")
        .notEmpty().withMessage("required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("newPassword")
        .notEmpty().withMessage("required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
        .notEmpty().withMessage("required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
], HandleValidationRequest, UserController.changePassword);

module.exports = router;