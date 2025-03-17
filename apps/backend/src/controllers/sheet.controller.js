import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS } from "../constants/statusCodes.js";
import { ApiError } from "../utils/ApiError.js";
import { addSheets, renameSheets } from "../database/queries/sheet.queries.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  sheetNameBodySchema,
  sheetRenameBodySchema,
} from "../models/zod-schemas/sheet.schemas.js";

export const createSheet = asyncHandler(async (req, res) => {
  const users = req.users;
  const spreadsheetId = req.params.spreadsheetId;
  const userId = req.session.user_id;

  const user = users.find((u) => u.user_id === userId);

  if (!user) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User don't have access to the spreadsheet"
    );
  }

  if (user.role !== "editor") {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User don't have edit access"
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
      "User don't have access to the spreadsheet"
    );
  }

  if (user.role !== "editor") {
    throw new ApiError(
      STATUS.CLIENT_ERROR.FORBIDDEN,
      "User don't have edit access"
    );
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
    .json(new ApiResponse(renamedSheets, "Sheets renamed successfully."));
});
