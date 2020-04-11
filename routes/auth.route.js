const express = require('express')
const { signup, signin, signout, forgotPassword, resetPassword } = require('../controllers/auth.controller')
const { userById } = require('../controllers/user.controller')
const { userSignupValidator, passwordResetValidator } = require("../validator")

const router = express.Router()



router.post("/signup", userSignupValidator, signup)
router.post("/signin", signin)

//router.post("/social-login", socialLogin)
// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

router.get("/signout", signout)
// any route containing: userId, our app will first execute userByID()
router.param("userId", userById)

module.exports = router;