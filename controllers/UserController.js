const createToken = require('../jwt/createToken')
const Users = require('../models/Users')
const fs = require("fs");
const path = require("path");
const { OAuth2Client } = require('google-auth-library');

const UserController = {

    register: async (req, res) => {
        try {
            const { name, email, password, image, role } = req.body;
            let user = await Users.register(name, email, password, image, role);
            const token = createToken(user._id);
            res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });
            return res.status(200).json({ user, token })
        } catch (err) {
            return res.status(400).json({ error: err.message }); // <-- send error to frontend
        }
    },
    login: async (req, res) => {
        try {
            const { email, password, roleType } = req.body;
            let user = await Users.login(email, password, roleType);
            const token = createToken(user._id);
            console.log(token);
            res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });
            return res.status(200).json({ user, token })
        } catch (err) {
            return res.status(400).json({ errors: err.message });
        }
    },
    logout: (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 })
        return res.status(200).json({ message: "logout success" })
    },
    clearUsers: async (req, res) => {
        try {
            const result = await Users.deleteMany({});
            const or = await Users.find();
            return res.json(or);
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await Users.findByIdAndDelete({ _id: id });
            const user = await Users.find();
            return res.json(user);
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    },
    getUsers: async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = 10;

            let totalCount = await Users.find().countDocuments();
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

            const users = await Users.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            return res.json({ users, dataLink });
        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { name, email, id } = req.body;
            const existingUser = await Users.findById(id);
            if (!existingUser) return res.status(404).json({ error: "User not found" });

            let imageFilename = existingUser.image; // keep old image by default

            if (req.file) {
                // New image uploaded
                imageFilename = req.file.filename;

                // Delete old image if it exists and file exists
                if (existingUser.image) {
                    const oldImagePath = path.join(__dirname, "..", "uploads", existingUser.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            const updateData = {
                name,
                email,
                image: imageFilename
            };

            const user = await Users.findByIdAndUpdate(id, updateData, { new: true });
            return res.json(user);

        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    updateImage: async (req, res) => {
        try {
            const { id } = req.body;
            console.log(req.body);
            const existingUser = await Users.findById(id);
            if (!existingUser) return res.status(404).json({ error: "User not found" });

            let imageFilename = existingUser.image; // keep old image by default

            if (req.file) {
                // New image uploaded
                imageFilename = req.file.filename;

                // Delete old image if it exists and file exists
                if (existingUser.image) {
                    const oldImagePath = path.join(__dirname, "..", "uploads", existingUser.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            const updateData = {
                image: imageFilename
            };

            const user = await Users.findByIdAndUpdate(id, updateData, { new: true });
            console.log(user);
            return res.json(user);

        } catch (err) {
            console.error("Failed to clear orders:", err);
        }
    },
    changePassword: async (req, res) => {
        try {

            const { email, currentPassword, newPassword, confirmPassword } = req.body;
            console.log(req.body);
            const result = await Users.changePassword(email, currentPassword, newPassword, confirmPassword);
            return res.status(200).json(result);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
    authGoogle: async (req, res) => {
        const { idToken } = req.body;
        console.log(idToken);

        try {
            // Verify the Google ID token
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const { sub, email, name, picture } = ticket.getPayload();

            // Check if user already exists by googleId
            let user = await Users.findOne({ googleId: sub });

            if (!user) {
                // If not, create new user (no password needed)
                user = await Users.create({
                    googleId: sub,
                    email,
                    name,
                    image: picture || '',
                    role: 'user'
                });
            }

            const token = createToken(user._id);
            res.cookie('jwt', token, { maxAge: 60 * 60 * 1000 });

            return res.status(200).json({ user, token });

        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'Invalid Google token' });
        }
    }
}

module.exports = UserController;