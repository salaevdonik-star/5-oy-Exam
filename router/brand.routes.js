const {Router} = require("express")
const { getAllBrands, getOneBrand, addBrand, updateBrand, deleteBrand, search } = require("../controller/brand.controller")
const brandValidateMiddleware = require("../middleware/brand.validate.middleware")
const authorization = require("../middleware/authorization")
const adminChecker = require("../middleware/admin.checker")
const multer = require("../config/multer")

const brandRouter = Router()

brandRouter.get("/get_all_brands", getAllBrands)
brandRouter.get("/get_one_brand/:id", getOneBrand)
brandRouter.get("/search_brand", search)
brandRouter.post("/add_brand", multer.single("logo"), authorization, adminChecker, brandValidateMiddleware,addBrand);
brandRouter.put("/update_brand/:id", multer.single("logo"), authorization, adminChecker, updateBrand);
brandRouter.delete("/delete_brand/:id", authorization, adminChecker, deleteBrand);

module.exports = brandRouter
