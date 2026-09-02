const User = require("../models/User")
const bcrypt = require("bcrypt")
const validator = require("validator")
const genrateToken = require("../utils/genrateToken")

// register
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
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
            password: hashedPassword,
            role: role
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

// login
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success:false, message:"Wrong password"})
        }

        const token = genrateToken(user._id, user.role);

        res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
        } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
        }
    }

    // const createToken = (id) => {
    // return jwt.sign({id},process.env.JWT_SECRET);
    // }




module.exports = {register, loginUser}