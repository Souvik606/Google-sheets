import { asyncHandler } from "../utils/asyncHandler.js";
import {
  spreadSheetBodySchema,
  spreadSheetDescriptionBodySchema,
  spreadSheetNameBodySchema,
  usersAccessBodySchema,
} from "../models/zod-schemas/spreadsheet.schemas.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS } from "../constants/statusCodes.js";
import {
  addSpreadsheet,
  editSpreadsheetDescription,
  findSpreadsheetById,
  getAllSpreadsheets,
  renameSpreadsheet,
  updateUserAccess,
  deleteSpreadsheetById,
  fetchSheets,
  searchSpreadsheetsByNames,
} from "../database/queries/spreadsheet.queries.js";
import { addSheets } from "../database/queries/sheet.queries.js";
import dayjs from "dayjs";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createSpreadsheet = asyncHandler(async (req, res) => {
  const session = req.session;
  const { name, description } = spreadSheetBodySchema.parse(req.body);

  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  let spreadSheet,
    sheet,
    sheetName = "Sheet1";

  try {
    spreadSheet = await addSpreadsheet(
      session.user_id,
      name,
      description,
      currentTime
    );
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while creating spreadsheet",
      err
    );
  }

  if (!spreadSheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to create spreadsheet"
    );
  }

  try {
    sheet = await addSheets(spreadSheet.spreadsheet_id, sheetName);
  } catch (err) {
    await deleteSpreadsheetById(spreadSheet.spreadsheet_id);
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
    .status(STATUS.SUCCESS.CREATED)
    .json(new ApiResponse(spreadSheet, "Successfully created spreadsheet"));
});

export const updateSpreadsheetAccess = asyncHandler(async (req, res) => {
  const session = req.session;

  if (session.user_id !== req.ownerId) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Unauthorized access");
  }

  const spreadsheetId = req.params.spreadsheetId;
  let users;

  const usersArray = usersAccessBodySchema.parse(req.body);

  try {
    users = await updateUserAccess(spreadsheetId, usersArray.users);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while updating access",
      err
    );
  }

  if (!users || users.length <= 0) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to update user access"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(users, "Successfully updated user access"));
});

export const updateSpreadsheetName = asyncHandler(async (req, res) => {
  const { name } = spreadSheetNameBodySchema.parse(req.body);

  const spreadsheetId = req.params.spreadsheetId;
  const session = req.session;

  if (session.user_id !== req.ownerId) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Unauthorized access");
  }

  const existingSpreadsheet = await findSpreadsheetById(spreadsheetId);

  if (existingSpreadsheet.length <= 0) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Invalid spreadsheet ID"
    );
  }

  let spreadsheet;
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  try {
    spreadsheet = await renameSpreadsheet(spreadsheetId, name, currentTime);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while renaming spreadsheet",
      err
    );
  }

  if (!spreadsheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to rename spreadsheet"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(spreadsheet, "Successfully renamed spreadsheet"));
});

export const updateSpreadsheetDescription = asyncHandler(async (req, res) => {
  const { description } = spreadSheetDescriptionBodySchema.parse(req.body);

  const session = req.session;

  if (session.user_id !== req.ownerId) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Unauthorized access");
  }

  const spreadsheetId = req.params.spreadsheetId;

  const existingSpreadsheet = await findSpreadsheetById(spreadsheetId);

  if (existingSpreadsheet.length <= 0) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Invalid spreadsheet ID"
    );
  }

  let spreadsheet;
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");

  try {
    spreadsheet = await editSpreadsheetDescription(
      spreadsheetId,
      description,
      currentTime
    );
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while renaming spreadsheet",
      err
    );
  }

  if (!spreadsheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to change spreadsheet description"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(
      new ApiResponse(
        spreadsheet,
        "Successfully changed spreadsheet description"
      )
    );
});

export const getSpreadsheets = asyncHandler(async (req, res) => {
  const session = req.session;
  let spreadsheets;

  try {
    spreadsheets = await getAllSpreadsheets(session.user_id);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while getting spreadsheets",
      err
    );
  }

  if (!spreadsheets) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to get spreadsheets"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(spreadsheets, "Successfully fetched spreadsheets"));
});

export const deleteSpreadsheet = asyncHandler(async (req, res) => {
  let deletedSpreadsheet;

  const spreadsheetId = req.params.spreadsheetId;
  const session = req.session;

  if (session.user_id !== req.ownerId) {
    throw new ApiError(STATUS.CLIENT_ERROR.UNAUTHORIZED, "Unauthorized access");
  }

  const existingSpreadsheet = await findSpreadsheetById(spreadsheetId);

  if (existingSpreadsheet.length <= 0) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Invalid spreadsheet ID"
    );
  }

  try {
    deletedSpreadsheet = await deleteSpreadsheetById(spreadsheetId);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while deleting spreadsheet",
      err
    );
  }

  if (!deletedSpreadsheet) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to delete spreadsheet"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(
      new ApiResponse(deletedSpreadsheet, "Successfully deleted spreadsheet")
    );
});

export const getAllSheets = asyncHandler(async (req, res) => {
  const spreadsheetId = req.params.spreadsheetId;
  let sheets;

  try {
    sheets = await fetchSheets(spreadsheetId);
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while fetching sheets",
      err
    );
  }

  if (!sheets) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to fetch sheets"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(sheets, "Sheets fetched successfully"));
});

export const searchSpreadsheets = asyncHandler(async (req, res) => {
  const session = req.session;
  const searchQuery = req.query.query || "";
  const resultsPerPage = 2;
  const pageOffset = (parseInt(req.query.page, 10) - 1) * resultsPerPage || 0;
  let spreadsheets;

  try {
    spreadsheets = await searchSpreadsheetsByNames(
      session.user_id,
      searchQuery,
      pageOffset,
      resultsPerPage
    );
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while searching spreadsheets",
      err
    );
  }

  if (!spreadsheets) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to search spreadsheets"
    );
  }

  return res
    .status(STATUS.SUCCESS.OK)
    .json(new ApiResponse(spreadsheets, "Successfully searched spreadsheets"));
});
