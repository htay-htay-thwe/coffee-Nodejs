const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
    const token = req.cookies?.jwt || req.headers['authorization']?.split(' ')[1]
    if (!token) {
        return res.status(400).json({ message: "Token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedValue) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // attach decoded user info for use in controllers
        req.user = decodedValue;
        next();
    });
};

module.exports = AuthMiddleware;
