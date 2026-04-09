import Register from "../models/register.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//! Registration controller
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //? Check if user already exists
        const isUserAlreadyExists = await Register.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(409).json({
                error: "User already exists",
                success: false
            });
        }

        //? Create user (already saves to DB)
        const user = await Register.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};






//! Login controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //? Check if user exists
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
                success: false
            });
        }

        //? Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: "Invalid credentials - incorrect password",
                success: false
            });
        }

        //? Generate JWT token
        const jwtToken = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        const options = {
            httpOnly: true,
            secure: false
        };


        return res.status(200)
            .cookie("token", jwtToken, options)
            .json({
                message: "Login successful",
                success: true,
                token: jwtToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}



//! logout user
const logoutUser = async (req, res, next) => {
    try {
        const options = {
            httpOnly: true,
            secure: false
        };

        return res.status(200)
            .clearCookie("token", options)
            .json({
                message: "Logout successful",
                success: true
            });
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}




export {
    registerUser,
    loginUser,
    logoutUser
};