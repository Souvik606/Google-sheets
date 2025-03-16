import { sql } from "../database.js";

export const addSheets = async (spreadsheetId, sheetName) => {
    const sheet = await sql`
    INSERT INTO sheets(spreadsheet_id,sheet_name)
    VALUES(${spreadsheetId},${sheetName})
    RETURNING *
    `;
    return sheet[0];
};
