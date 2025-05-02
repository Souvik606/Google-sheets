import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS } from "../constants/statusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import {
  addSheets,
  createComments,
  fetchComments,
  findSheetById,
  renameSheets,
  deleteSheets,
} from "../database/queries/sheet.queries.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  commentBodySchema,
  sheetNameBodySchema,
  sheetRenameBodySchema,
} from "../models/zod-schemas/sheet.schemas.js";
import dayjs from "dayjs";

export const createSheet = asyncHandler(async (req, res) => {
  const users = req.users;
  const spreadsheetId = req.params.spreadsheetId;
  const userId = req.session.user_id;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have access to the spreadsheet"
    );
  }

  if (user.role !== "editor") {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have edit access"
    );
  }

  let sheet;
  const { name } = sheetNameBodySchema.parse(req.body);

  try {
    sheet = await addSheets(spreadsheetId, name);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while creating sheet",
      err
    );
  }

  if (!sheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to create sheet"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(sheet, "Sheet created successfully."));
});

export const renameSheet = asyncHandler(async (req, res) => {
  const users = req.users;
  const sheetId = req.params.sheetId;
  const userId = req.session.user_id;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have access to the spreadsheet"
    );
  }

  if (user.role !== "editor") {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have edit access"
    );
  }

  const sheet = await findSheetById(sheetId);

  if (!sheet) {
    throw new ApiError(STATUS.CLIENT_ERROR.BAD_REQUEST, "Invalid sheet ID");
  }

  let renamedSheets;
  const { name } = sheetRenameBodySchema.parse(req.body);

  try {
    renamedSheets = await renameSheets(sheetId, name);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while renaming sheet",
      err
    );
  }

  if (!renamedSheets) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to rename sheet"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(renamedSheets, "Sheet renamed successfully."));
});

export const postComment = asyncHandler(async (req, res) => {
  const users = req.users;
  const userId = req.session.user_id;
  const sheetId = req.params.sheetId;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have access to the spreadsheet"
    );
  }

  const sheet = await findSheetById(sheetId);
  let comment;

  if (!sheet) {
    throw new ApiError(STATUS.CLIENT_ERROR.FORBIDDEN, "Invalid sheet ID");
  }

  const { content } = commentBodySchema.parse(req.body);
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  try {
    comment = await createComments(sheetId, userId, content, currentTime);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while posting comment",
      err
    );
  }

  if (!comment) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to post comment"
    );
  }

  return res
    .status(STATUS.SUCCESS.CREATED)
    .json(new ApiResponse(comment, "Comment posted successfully."));
});

export const getAllComments = asyncHandler(async (req, res) => {
  const users = req.users;
  const spreadsheetId = req.params.spreadsheetId;
  const userId = req.session.user_id;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have access to the spreadsheet"
    );
  }

  let comments;

  try {
    comments = await fetchComments(spreadsheetId);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while fetching comments",
      err
    );
  }

  if (!comments) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to fetch comments"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(comments, "Comments fetched successfully"));
});

export const deleteSheet = asyncHandler(async (req, res) => {
  const users = req.users;
  const sheetId = req.params.sheetId;
  const userId = req.session.user_id;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User doesn't have access to the spreadsheet"
    );
  }

  if (user.role !== "editor") {
    throw new ApiError(STATUS.CLIENT_ERROR.FORBIDDEN, "User is not Editor");
  }

  let sheet;

  try {
    sheet = await deleteSheets(sheetId);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while deleting sheet",
      err
    );
  }

  if (!sheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to delete sheet"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(sheet, "Sheet deleted successfully."));
});
