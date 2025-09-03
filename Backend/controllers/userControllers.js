import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404)
            return res.json({
                success: false,
                message: "User doesn't exist"
            })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = createToken(user._id);
            res.status(200) 
            return res.json({
                success: true,
                message: "Login Successfull",
                token
            })
        } else {
            res.status(400)
            return res.json({
                success: false,
                message: "Incorrect Credentials"
            })
        }
    } catch (error) {
        res.status(500)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const exist = await userModel.findOne({email})
        if (exist) {
            res.status(400)
            return res.json({
                success: false, 
                message: "The User with email is already Exist try to Login"
            });
        }
        if (password.length < 8) {
            res.status(400)
            return res.json({
                success: false, 
                message: "Please provide a strong password"
            });
        }
        if (!validator.isEmail(email)) {
            res.status(400)
            return res.json({
                success: false,
                message: "Please give an valid Email"
            })
        }
 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(200)
        res.json({
            success: true,
            message: "User Registeration Successfull",
            token
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const adminLogin = async (req, res) => {

}

export { loginUser, registerUser, adminLogin };