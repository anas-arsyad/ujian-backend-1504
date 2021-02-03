const router =require('express').Router()

// import controller
const {movieController} = require('../controller')

const { verifyToken } = require('../helpers/jwt')



router.get("/get/All",movieController.getAll)
router.get("/get",movieController.getMovies)
router.post("/add",movieController.addMovies)
router.patch("/edit/:id",verifyToken,movieController.edit)
router.patch("/set/:id",verifyToken,movieController.set)














module.exports=router