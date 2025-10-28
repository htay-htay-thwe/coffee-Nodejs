const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const coffeeRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const userRoute = require("./routes/user")

const AuthMiddleware = require("./middlewares/AuthMiddleware")

const app = express();
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});


app.use(cors({
    origin: ["*", "http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser())

app.use("/api/coffee", AuthMiddleware, coffeeRoute)
app.use("/api/order", AuthMiddleware, orderRoute)
app.use("/api/user", userRoute)

const mongoUrl = "mongodb://mongo:zOhSGYRlsJcVCxlmWCfDRwYnmbrQkiro@mongodb.railway.internal:27017"

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
    return res.json({ message: 'hello mern stack' })
})

mongoose.connect(mongoUrl).then(() => {
    console.log("database connected ...")
})

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`app is running on port ${process.env.PORT}`)
})