import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { STATUS } from "../constants/statusCodes.js";
import { findSheetById } from "../database/queries/sheet.queries.js";
import { cellBodySchema } from "../models/zod-schemas/cell.schemas.js";
import dayjs from "dayjs";
import { createCell } from "../database/queries/cell.queries.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addCell = asyncHandler(async (req, res) => {
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

  const sheet = await findSheetById(sheetId);

  if (!sheet) {
    throw new ApiError(STATUS.CLIENT_ERROR.FORBIDDEN, "Invalid sheet Id");
  }

  let cell;
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const { row, col, value, data_format } = cellBodySchema.parse(req.body);

  try {
    if (data_format) {
      cell = await createCell(
        row,
        col,
        value,
        sheetId,
        userId,
        currentTime,
        data_format
      );
    } else {
      cell = await createCell(
        row,
        col,
        value,
        sheetId,
        userId,
        currentTime,
        ""
      );
    }
  } catch (err) {
    throw new ApiError(
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      "Something went wrong while adding cell",
      err
    );
  }

  if (!cell) {
    throw new ApiError(
      STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE,
      "Failed to create cell"
    );
  }

  return res
    .status(STATUS.SUCCESS.CREATED)
    .json(
      new ApiResponse(
        cell,
        `Cell with row ${row} and column ${col} created successfully`
      )
    );
});
