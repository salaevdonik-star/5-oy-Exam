const CustomErrorHandler = require("../error/error");
const BrandSchema = require("../schema/brand.schema");

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await BrandSchema.find();

    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { searchingvalue } = req.query;

    const brands = await BrandSchema.find({
      name: { $regex: searchingvalue, $options: "i" },
    });

    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

const addBrand = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!req.file) {
      throw CustomErrorHandler.BadRequest("file bolishi shart!");
    }

    await BrandSchema.create({
      name,
      logo: "http://localhost:4001/uploads/" + req.file.filename,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Added new brand",
    });
  } catch (error) {
    next(error);
  }
};

const getOneBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const foundedBrand = await BrandSchema.findById(id);

    if (!foundedBrand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    res.status(200).json(foundedBrand);
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const foundedBrand = await BrandSchema.findById(id);

    if (!foundedBrand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    const updateData = { name };

    if (req.file) {
      updateData.logo = "http://localhost:4001/uploads/" + req.file.filename;
    }

    await BrandSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      message: "Updated brand",
    });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const foundedBrand = await BrandSchema.findById(id);

    if (!foundedBrand) {
      throw CustomErrorHandler.NotFound("Brand not found");
    }

    await BrandSchema.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: "Deleted brand",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBrands,
  getOneBrand,
  addBrand,
  updateBrand,
  deleteBrand,
  search,
};
