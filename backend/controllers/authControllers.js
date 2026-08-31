const User = require("../models/User")
const bcrypt = require("bcrypt")
const validator = require("validator")

// register
const register = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        // checking user
        const exists = await User.findOne({email});
        if(exists){
            return res.json({success: false, message: "User is already exist"})
        }
        // validating email and strong password
        if (!validator.isEmail(email)){
            return res.json({success:false, message:"Enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success:false, message:"Enter a strong password"})
        }

        // hashing or password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        res.status(201).json({
            message:"User regiesterd successfully",
            newUser: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
        });
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}


module.exports = {register}