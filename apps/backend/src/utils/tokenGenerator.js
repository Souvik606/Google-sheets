import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../../env.js";

export const generateAccessToken = function (user, currentTime) {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      name: user.name,
      session_created_at: currentTime,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const generateRefreshToken = function (user, currentTime) {
  return jwt.sign(
    {
      id: user.user_id,
      session_created_at: currentTime,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};
