import { asyncHandler } from "../utils/asyncHandler.js";
import {
  findAllUsers,
  findSpreadsheetById,
} from "../database/queries/spreadsheet.queries.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS } from "../constants/statusCodes.js";

export const verifyOwner = asyncHandler(async (req, res, next) => {
  const spreadsheetId = req.params.spreadsheetId;

  const spreadSheet = await findSpreadsheetById(spreadsheetId);

  if (spreadSheet.length <= 0) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Invalid spreadsheet ID"
    );
  }

  req.ownerId = spreadSheet[0].owner_id;
  next();
});

export const verifyAccess = asyncHandler(async (req, res, next) => {
  const spreadsheetId = req.params.spreadsheetId;

  const spreadSheet = await findSpreadsheetById(spreadsheetId);

  if (spreadSheet.length <= 0) {
    throw new ApiError(
      STATUS.CLIENT_ERROR.BAD_REQUEST,
      "Invalid spreadsheet ID"
    );
  }

  req.users = await findAllUsers(spreadsheetId);
  next();
});
