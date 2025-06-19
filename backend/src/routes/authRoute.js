import express from 'express'
import { logIn, logOut, singUp, onboard } from '../controllers/authController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

// ALL of these ROUTER have prefix with /api/auth
router.post(`/signup`,singUp)
router.post(`/login`, logIn)
router.post(`/logout`, logOut)

router.post(`/onboarding`, protectRoute, onboard)

// check if user is logged in
router.get(`/me`, protectRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
})

export default router