const {Router} = require("express")
const { getAllCars, getOneCar, getCarsByBrand, search, addCar, updateCar, deleteCar } = require("../controller/car.controller")
const carValidateMiddleware = require("../middleware/car.validate.middleware")
const adminChecker = require("../middleware/admin.checker")
const multer = require("../config/multer")
const authorization = require("../middleware/authorization")

const carRouter = Router()

carRouter.get("/get_all_cars", getAllCars)
carRouter.get("/get_one_car/:id", getOneCar)
carRouter.get("/get_cars_by_brand/:brand_id", getCarsByBrand)
carRouter.get("/search_car", search)
carRouter.post("/add_car", authorization, adminChecker, multer.carFields, carValidateMiddleware, addCar)
carRouter.put("/update_car/:id", authorization,adminChecker,multer.carFields, updateCar)
carRouter.delete("/delete_car/:id",authorization, adminChecker, deleteCar)

module.exports = carRouter
