import { sql } from "../database.js";

export const addSpreadsheet = async (ownerId, name, description, timestamp) => {
  const spreadsheet = await sql`
    INSERT INTO spreadsheets(spreadsheet_name,owner_id,last_edited_at,last_edited_id,created_at,description)
    VALUES (${name},${ownerId},${timestamp},${ownerId},${timestamp},${description})
    RETURNING *
    `;
  return spreadsheet[0];
};

export const findSpreadsheetById = async (spreadsheetId) => {
  try {
    return await sql`
    SELECT * from spreadsheets WHERE spreadsheet_id = ${spreadsheetId}
    `;
  } catch (err) {
    console.log(err);
  }
};

export const renameSpreadsheet = async (
  spreadsheetId,
  newName,
  userId,
  timestamp
) => {
  try {
    const spreadsheet = await sql`
    UPDATE spreadsheets SET new_name = ${newName},last_edited_at = ${timestamp},last_edited_id = ${userId};
    WHERE spreadsheet_id = ${spreadsheetId}
    RETURNING *
    `;
    return spreadsheet[0];
  } catch (err) {
    console.log(err);
  }
};

export const editSpreadsheetDescription = async (
  spreadsheetId,
  newDescription,
  userId,
  timestamp
) => {
  try {
    const spreadsheet = await sql`
    UPDATE spreadsheets SET description = ${newDescription},last_edited_at = ${timestamp},last_edited_id = ${userId};
    WHERE spreadsheet_id = ${spreadsheetId}
    RETURNING *
    `;
    return spreadsheet[0];
  } catch (err) {
    console.log(err);
  }
};

export const updateUserAccess = async (spreadsheetId, usersArray) => {
  console.log("usersArray", usersArray);
  try {
    // Fetch user_id for each email
    const users = await sql`
        SELECT user_id, email FROM Users WHERE email = ANY(${usersArray.map((user) => user.email)});
    `;

    // Create user-role mapping
    const userRoleArray = users.map((user) => ({
      user_id: user.user_id,
      role: usersArray.find((u) => u.email === user.email)?.role, // Get the corresponding role
    }));

    console.log("userRoleArray", userRoleArray);

    if (userRoleArray.length === 0) {
      console.log("No matching users found.");
      return [];
    }

    // Store query results
    const updatedRecords = [];

    // Insert into Sheet_access table
    for (const { user_id, role } of userRoleArray) {
      const result = await sql`
        INSERT INTO Sheet_access (sheet_id, user_id, role) 
        VALUES (${spreadsheetId}, ${user_id}, ${role})
        ON CONFLICT (sheet_id, user_id) 
        DO UPDATE SET role = EXCLUDED.role
        RETURNING *;
      `;

      updatedRecords.push(result[0]); // Store each updated record
    }

    return updatedRecords;
  } catch (err) {
    console.log("Error updating user access:", err);
    throw err; // Rethrow error for proper handling
  }
};
