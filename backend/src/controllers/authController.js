import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"

// SING-UP CONTROLLER //
export async function singUp(req, res) {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are Required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        // Regular Expression for check from the shape of email that has @
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already existing, please use a different one" })
        }

        // create an avatar
        const index = Math.floor(Math.random() * 100) + 1 // gen number [1, 100]
        const randomAvatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=chatlyuser${index}.png`

        // create the new User
        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        })


        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error Creating Stream user", error)
        }

        // create the token and cookie
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day in millie Secund
            httpOnly: true, // prevent XSS attacks // can't access cookie from JavaScript
            sameSite: "strict", // prevent CSRF attacks // Prevents the browser from sending cookies in cross-site requests
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({ success: true, user: newUser, message: "Creating New User" })

    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({ message: "Server Error" })
    }
}

//  LOG-IN CONTROLLER //
export async function logIn(req, res) {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are Required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        // create the token and cookie
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day in millie Secund
            httpOnly: true, // prevent XSS attacks // can't access cookie from JavaScript
            sameSite: "strict", // prevent CSRF attacks // Prevents the browser from sending cookies in cross-site requests
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log("Error in signup controller", error)
        res.status(500).json({ message: "Server Error" })
    }
}

//  LOG-OUT CONTROLLER //
export function logOut(req, res) {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logout successfully" })
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are Required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true })

        if (!updatedUser) {
            return res.status(404).json({ message: "User Not found" })
        }

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            })

            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding: ", streamError.message)
        }

        res.status(200).json({ success: true, user: updatedUser })
    } catch (error) {
        console.error("Onboarding Error: ", error)
        res.status(500).json("Server Error")
    }
}