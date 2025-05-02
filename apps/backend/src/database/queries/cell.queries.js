import { sql } from "../database.js";

export const createCell = async (
  row,
  col,
  value,
  sheetId,
  userId,
  timestamp,
  dataFormat
) => {
  const cell = await sql`
    INSERT INTO cells(row,col,sheet_id,data_format,value,last_edited_at,latest_edited_id)
    VALUES(${row},${col},${sheetId},${dataFormat},${value},${timestamp},${userId})
    RETURNING row,col,sheet_id,data_format,value,last_edited_at,latest_edited_id
    `;
  return cell[0];
};
