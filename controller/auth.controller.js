const CustomErrorHandler = require("../error/error");
const AuthSchema = require("../schema/auth.schema");
const BrandSchema = require("../schema/brand.schema");
const CarSchema = require("../schema/car.schema");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email-sender");
const { access_token, refresh_token } = require("../validator/token.generator");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    if (foundedUser) {
      throw CustomErrorHandler.UnAuthorized("User already exists");
    }

    const randomCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join("");

    const dateNow = Date.now() + 120000;

    const hashPassword = await bcrypt.hash(password, 12);

    await sendEmail(email, randomCode);

    await AuthSchema.create({
      username,
      email,
      password: hashPassword,
      otp: randomCode,
      otpTime: dateNow,
    });

    res.status(201).json({
      message: "Registered",
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    if (foundedUser.otpTime < Date.now()) {
      throw CustomErrorHandler.UnAuthorized("code expired");
    }

    if (foundedUser.otp !== code) {
      throw CustomErrorHandler.UnAuthorized("wrong code");
    }

    const payload = {
      id: foundedUser._id,
      email: foundedUser.email,
      role: foundedUser.role,
    };

    const access = access_token(payload);
    const refresh = refresh_token(payload);

    res.cookie("accessToken", access, {
      httpOnly: true,
      maxAge: 60 * 1000 * 15,
    });
    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      otp: "",
      otpTime: 0,
    });

    res.status(200).json({
      message: "Success",
      token: access,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const decode = await bcrypt.compare(password, foundedUser.password);

    if (!decode) {
      throw CustomErrorHandler.UnAuthorized("Wrong password");
    }

    const randomCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join("");

    const dateNow = Date.now() + 120000;

    await sendEmail(email, randomCode);

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      otp: randomCode,
      otpTime: dateNow,
    });

    res.status(200).json({
      message: "Please check your email",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const foundedUser = await AuthSchema.findOne({ _id: req.user.id }).select(
      "-password -otp -otpTime",
    );

    if (!foundedUser) {
      throw CustomErrorHandler.NotFound("User not found");
    }
    const profileData = foundedUser.toObject();

    if (foundedUser.role === "admin" || foundedUser.role === "superadmin") {
      const myBrands = await BrandSchema.find({ created_by: foundedUser._id });
      const myCars = await CarSchema.find({
        created_by: foundedUser._id,
      }).populate("brand_info", "-createdAt -updatedAt");

      profileData.my_brands = myBrands;
      profileData.my_cars = myCars;
    }
    res.status(200).json(profileData);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const foundedUser = await AuthSchema.findOne({ email });

    if (!foundedUser) {
      throw CustomErrorHandler.UnAuthorized("User not found");
    }

    const randomCode = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join("");

    const dateNow = Date.now() + 120000;

    await sendEmail(email, randomCode);

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      otp: randomCode,
      otpTime: dateNow,
    });

    res.status(200).json({
      message: "Please check your email",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { new_password } = req.body;

    const foundedUser = await AuthSchema.findOne({ email: req.user.email });

    if (!foundedUser) {
      throw CustomErrorHandler.NotFound("User not found");
    }

    const hashPassword = await bcrypt.hash(new_password, 12);

    await AuthSchema.findByIdAndUpdate(foundedUser._id, {
      password: hashPassword,
    });

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  logout,
  getProfile,
  forgotPassword,
  changePassword,
};
