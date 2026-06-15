const {Router} = require("express")
const { register, verify, login, logout, getProfile, forgotPassword, changePassword } = require("../controller/auth.controller")
const authValidateMiddleware = require("../middleware/auth.validate.middleware")
const refreshToken = require("../middleware/refresh-token")
const authorization = require("../middleware/authorization")

const authRouter = Router()

authRouter.post("/register", authValidateMiddleware, register)
authRouter.post("/verify", verify)
authRouter.post("/login", login)
authRouter.get("/refresh", refreshToken)
authRouter.get("/logout", logout)
authRouter.post("/forgot_password", forgotPassword)
authRouter.post("/change_password", authorization, changePassword)
authRouter.get("/profile", authorization, getProfile)

module.exports = authRouter
