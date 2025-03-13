import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS } from "../constants/statusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createSession,
  createUser,
  deleteSessionById,
  deleteUserById,
  findUserbyEmail,
} from "../database/queries/auth.queries.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerator.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cookieOptions } from "../constants/cookieOptions.js";
import dayjs from "dayjs";
import bcrypt from "bcryptjs";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "All fields are required"
    );
  }

  if (password?.length < 6) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Password should be at least 6 characters"
    );
  }

  const existedUser = await findUserbyEmail(email);

  if (existedUser.length > 0) {
    throw new ApiError(STATUS.CLIENT_ERROR.FORBIDDEN, "User already exists");
  }

  let user, profileIcon;

  const profileIconLocalPath = req.file?.path;

  if (profileIconLocalPath) {
    profileIcon = await uploadOnCloudinary(profileIconLocalPath);
  }

  try {
    user = await createUser(name, email, password, profileIcon?.url);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while registering user!"
    );
  }

  if (!user) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to register user"
    );
  }
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const accessToken = generateAccessToken(user, currentTime);
  const refreshToken = generateRefreshToken(user, currentTime);

  let session;

  try {
    session = await createSession(
      user.user_id,
      accessToken,
      refreshToken,
      currentTime
    );
  } catch (err) {
    await deleteUserById(user.user_id);
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while creating session!"
    );
  }

  if (!session) {
    await deleteUserById(user.user_id);
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to create session"
    );
  }

  return res
    .status(STATUS.SUCCESS.CREATED)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          profile_icon: user.profile_icon,
          session_id: session.session_id,
        },
        "User and Session created successfully"
      )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "All fields are required"
    );
  }

  const user = await findUserbyEmail(email);

  if (user.length <= 0) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Email doesn't exist");
  }

  const correctPassword = user[0].password;

  const isCorrectPassword = await bcrypt.compare(password, correctPassword);

  if (!isCorrectPassword) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Invalid password");
  }

  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const accessToken = generateAccessToken(user, currentTime);
  const refreshToken = generateRefreshToken(user, currentTime);

  const session = await createSession(
    user[0].user_id,
    accessToken,
    refreshToken,
    currentTime
  );

  if (!session) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to create session"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        {
          user_id: user[0].user_id,
          name: user[0].name,
          email: user[0].email,
          profile_icon: user[0].profile_icon,
          session_id: session.session_id,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const session = await deleteSessionById(req.session.session_id);

  return res
    .status(STATUS.SUCCESS.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(session[0], "Logged out successfully"));
});
