const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserData = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: false
    },
    googleId: {
        type: String,
        unique: true,
        required: false
    },
    image: {
        type: String,
        require: false,
        default: ""
    },
    role: {
        type: String,
        require: true,
        default: "user"
    },


}, { timestamps: true });

UserData.statics.register = async function (name, email, password, image, role) {

    const emailExits = await this.findOne({ email });

    if (emailExits) {
        throw new Error("user Exists!")
    }

    let salt = await bcrypt.genSalt();
    let hashValue = await bcrypt.hash(password, salt);

    const user = await this.create({
        name: name,
        email: email,
        password: hashValue,
        image: image,
        role: role
    })

    return user;
}

UserData.statics.changePassword = async function (email, currentPassword, newPassword, confirmPassword) {
    const user = await this.findOne({ email });

    if (!user) {
        throw new Error("User does not match in our records. Try again ...");
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return { message: "Password updated successfully" };
}

UserData.statics.login = async function (email, password, roleType) {
    let user = await this.findOne({ email });

    if (!user) {
        throw new Error("User does not match in our records. Try again ...")
    }

    if (user.role !== roleType) {
        console.log("Account Not Exist!");
        throw new Error("Account Not Exist!");
    }

    let passwordStatus = await bcrypt.compare(password.trim(), user.password);
    if (passwordStatus) {
        return user;
    } else {
        console.log("incorrect");
        throw new Error("Password Incorrect! Try again ...");
    }
}


module.exports = mongoose.model("Users", UserData)