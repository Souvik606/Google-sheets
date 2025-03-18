import { sql } from "../database.js";

export const addSheets = async (spreadsheetId, sheetName) => {
  const sheet = await sql`
    INSERT INTO sheets(spreadsheet_id,sheet_name)
    VALUES(${spreadsheetId},${sheetName})
    RETURNING *
    `;
  return sheet[0];
};

export const findSheetById = async (sheetId) => {
  const sheet = await sql`
    SELECT * FROM sheets
    WHERE sheet_id = ${sheetId};
    `;
  return sheet[0];
};

export const renameSheets = async (sheetId, newName) => {
  const renamedSheet = await sql`
    UPDATE sheets SET sheet_name = ${newName}
    WHERE sheet_id = ${sheetId}
    RETURNING *
    `;
  return renamedSheet[0];
};

export const fetchSheets = async (spreadsheetId) => {
  return sql`
    SELECT * FROM sheets
    WHERE spreadsheet_id = ${spreadsheetId}`;
};

export const createComments = async (sheetId, userId, content, timestamp) => {
  const comment = await sql`
    INSERT INTO comments (commenter_id, sheet_id, comment,time_stamp) 
    VALUES (${userId},${sheetId},${content},${timestamp})
    RETURNING *
    `;
  return comment[0];
};

export const fetchComments = async (spreadsheetId) => {
  return sql`
    SELECT C.*,U.name,S.sheet_name FROM comments C,users U,sheets S
    WHERE S.spreadsheet_id = ${spreadsheetId}
    AND C.sheet_id=S.sheet_id
    AND C.commenter_id=U.user_id`;
};
