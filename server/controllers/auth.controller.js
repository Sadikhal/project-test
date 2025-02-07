import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { createError } from "../lib/createError.js";
import jwt from "jsonwebtoken";




export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};


export const login = async (req,res ,next) => {
  try {
    const user = await User.findOne({
      email : req.body.email });
    
      if (!user) return next(createError(404,"User not found"));

      const isCorrect = bcrypt.compareSync(req.body.password , user.password);

      if(!isCorrect) return next(createError(404,"wrong password!"));

      const token = jwt.sign({
        id: user._id,
        role: user.role
      },
    process.env.JWT_KEY,
     { expiresIn: "7d" });

     const {password, ...info } = user._doc;
     res
     .cookie("access_token",token , {
       httpOnly: true,
       secure :true,
       sameSite: 'None',
     })
     .status(200)
     .send(info);
  } catch (error) {
    next(error);
  }
};


export const logOut = (req, res ,next ) => {
  res
  .clearCookie ("access_token", {
    sameSite:"NONE",
    secure: true
  })
  .status(200)
  .send("user has been logged out")
};