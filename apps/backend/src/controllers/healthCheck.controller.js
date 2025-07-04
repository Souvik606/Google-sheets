import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sql } from "../database/database.js";

const healthCheck = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse({}, "Status OK."));
});

const databaseCheck = asyncHandler(async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];

    return res
      .status(200)
      .json(new ApiResponse({ version }, "Database connection is healthy."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse({ ...error }, "Database check failed."));
  }
});

export { healthCheck, databaseCheck };
