import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const secretkey = process.env.SECRET_KEY;
const auth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.body.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, secretkey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
};

export default auth;