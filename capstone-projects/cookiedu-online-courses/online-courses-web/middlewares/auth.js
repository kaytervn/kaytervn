import jwt from "jsonwebtoken";
import "dotenv/config.js";
import User from "../models/UserModel.js";

const auth = async (req, res, next) => {
  //check if the header contain the key authorization (token)
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "You must be logged in!" }); //when user login, they will have token
  }

  // Grab the token from the header (Bearer token)
  const token = authorization.split(" ")[1];

  try {
    // Decode and extract the user id from token
    const { _id } = jwt.verify(token, process.env.SECRET);

    //save the user in the req object
    req.user = await User.findById(_id).select("_id");

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default auth;
