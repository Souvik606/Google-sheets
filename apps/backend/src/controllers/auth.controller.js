import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS } from "../constants/statusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import {
  createSession,
  createUser,
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

  let user,
    profileIconURL = "";

  const profileIconLocalPath = req?.file.path;

  if (profileIconLocalPath) {
    profileIconURL = await uploadOnCloudinary(profileIconLocalPath);
  }

  try {
    user = await createUser(name, email, password, profileIconURL);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong!"
    );
  }

  if (!user) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to register user"
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  let session;

  try {
    session = await createSession(user.user_id, accessToken, refreshToken);
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
    .cookies("accessToken", accessToken, cookieOptions)
    .cookies("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        { user: user, session: session },
        "User and Session created successfully"
      )
    );
});
