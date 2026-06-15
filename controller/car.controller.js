const CustomErrorHandler = require("../error/error");
const CarSchema = require("../schema/car.schema");

const getAllCars = async (req, res, next) => {
  try {
    const cars = await CarSchema.find().populate(
      "brand_info",
      "-createdAt -updatedAt",
    );

    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

const getCarsByBrand = async (req, res, next) => {
  try {
    const { brand_id } = req.params;

    const cars = await CarSchema.find({ brand_info: brand_id }).populate(
      "brand_info",
      "-createdAt -updatedAt",
    );

    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { searchingvalue } = req.query;

    const cars = await CarSchema.find({
      title: { $regex: searchingvalue, $options: "i" },
    }).populate("brand_info", "-createdAt -updatedAt");

    res.status(200).json(cars);
  } catch (error) {
    next(error);
  }
};

const addCar = async (req, res, next) => {
  try {
    const {
      title,
      brand_info,
      tanirovkasi,
      motor,
      year,
      color,
      distance,
      gearbook,
      narxi,
      description,
    } = req.body;

    if (!req.files || !req.files.picture) {
      throw CustomErrorHandler.BadRequest("Model turi uchun rasm shart!");
    }

    const picture = "http://localhost:4001/uploads/" + req.files.picture[0].filename;

    let picture_ichki = "";
    let picture_tashqi = "";

    if (req.files.picture_ichki) {
      picture_ichki = "http://localhost:4001/uploads/" + req.files.picture_ichki[0].filename;
    }

    if (req.files.picture_tashqi) {
      picture_tashqi = "http://localhost:4001/uploads/" + req.files.picture_tashqi[0].filename;
    }

    await CarSchema.create({
      title,
      brand_info,
      tanirovkasi,
      motor,
      year,
      color,
      distance,
      gearbook,
      narxi,
      picture,
      picture_ichki,
      picture_tashqi,
      description,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Added new car",
    });
  } catch (error) {
    next(error);
  }
};

const getOneCar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const foundedCar = await CarSchema.findById(id).populate(
      "brand_info",
      "-createdAt -updatedAt",
    );

    if (!foundedCar) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    res.status(200).json(foundedCar);
  } catch (error) {
    next(error);
  }
};

const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      brand_info,
      tanirovkasi,
      motor,
      year,
      color,
      distance,
      gearbook,
      narxi,
      description
    } = req.body;

    const foundedCar = await CarSchema.findById(id);

    if (!foundedCar) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    const updateData = {
      title,
      brand_info,
      tanirovkasi,
      motor,
      year,
      color,
      distance,
      gearbook,
      narxi,
      description,
    };

    if (req.files) {
      if (req.files.picture) {
        updateData.picture = "http://localhost:4001/uploads/" + req.files.picture[0].filename;
      }
      if (req.files.picture_ichki) {
        updateData.picture_ichki = "http://localhost:4001/uploads/" + req.files.picture_ichki[0].filename;
      }
      if (req.files.picture_tashqi) {
        updateData.picture_tashqi = "http://localhost:4001/uploads/" + req.files.picture_tashqi[0].filename;
      }
    }

    await CarSchema.updateOne({ _id: id }, updateData);

    res.status(200).json({
      message: "Updated car",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;

    const foundedCar = await CarSchema.findById(id);

    if (!foundedCar) {
      throw CustomErrorHandler.NotFound("Car not found");
    }

    await CarSchema.findByIdAndDelete({ _id: id });

    res.status(200).json({
      message: "Deleted car",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCars,
  getOneCar,
  getCarsByBrand,
  addCar,
  updateCar,
  deleteCar,
  search,
};
