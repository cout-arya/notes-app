import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id },   // ✅ Works for both cases
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id },   // ✅ Same here
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
