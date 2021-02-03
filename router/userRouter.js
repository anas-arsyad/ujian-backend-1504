// import express router
const router =require('express').Router()

// import controller
const {userController} = require('../controller')

const {body} = require("express-validator")
const { verifyToken } = require('../helpers/jwt')
const registerValidation=[
    body('username')
    .notEmpty()
    .withMessage("user name can't empty")
    .isLength({min:6})
    .withMessage("harus 6 karaketer username"),
    body('password')
    .notEmpty()
    .withMessage("password can't empty")
    .isLength({min:6})
    .withMessage("harus 6 karaketer password")
    .matches(/[0-9]/)
    .withMessage("harus ad aangka")
    .matches(/[!@#$%^&*]/)
    .withMessage("harus ad simbol"),
    body("email")
    .isEmail()
    .withMessage("email slah")
]

router.post("/register",registerValidation,userController.register)
router.post("/login",userController.login)
router.patch("/deactive",verifyToken, userController.deactive)
router.patch("/active",verifyToken, userController.active)
router.patch("/close",verifyToken, userController.close)






module.exports=router