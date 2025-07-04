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

export const renameSpreadsheet = async (spreadsheetId, newName, timestamp) => {
  try {
    const spreadsheet = await sql`
    UPDATE spreadsheets SET spreadsheet_name = ${newName},last_edited_at = ${timestamp}
    WHERE spreadsheet_id = ${spreadsheetId}
    RETURNING *
    `;
    return spreadsheet[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const editSpreadsheetDescription = async (
  spreadsheetId,
  newDescription,
  timestamp
) => {
  try {
    const spreadsheet = await sql`
    UPDATE spreadsheets SET description = ${newDescription},last_edited_at = ${timestamp}
    WHERE spreadsheet_id = ${spreadsheetId}
    RETURNING *
    `;
    return spreadsheet[0];
  } catch (err) {
    console.log(err);
  }
};

export const deleteSpreadsheetById = async (spreadsheetId) => {
  try {
    return await sql`
    DELETE FROM spreadsheets WHERE spreadsheet_id = ${spreadsheetId}
    RETURNING spreadsheet_id,spreadsheet_name
    `;
  } catch (err) {
    throw new Error(err);
  }
};

export const removeUserAccess = async (spreadsheetId, userId) => {
  try {
    await sql`
        UPDATE sheet_access
        SET wants = FALSE
        WHERE sheet_id = ${spreadsheetId} AND user_id = ${userId}
      `;
    return { spreadsheet_id: spreadsheetId, status: "access_removed" };
  } catch (err) {
    throw new Error(err);
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
        INSERT INTO Sheet_access (sheet_id, user_id, role, wants) 
        VALUES (${spreadsheetId}, ${user_id}, ${role}, TRUE)
        ON CONFLICT (sheet_id, user_id) 
        DO UPDATE SET role = EXCLUDED.role, wants = TRUE
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

export const getAllSpreadsheets = async (userId) => {
  try {
    return await sql`
    SELECT s.*, u.name AS owner_name
    FROM spreadsheets s
    JOIN "users" u ON s.owner_id = u.user_id
    WHERE s.owner_id = ${userId}
    UNION
    SELECT s.*, u.name AS owner_name
    FROM spreadsheets s
    JOIN sheet_access sa ON sa.sheet_id = s.spreadsheet_id
    JOIN "users" u ON s.owner_id = u.user_id
    WHERE sa.user_id = ${userId} AND sa.wants = TRUE
    ORDER BY last_edited_at DESC;
    `;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const findAllUsers = async (spreadsheetId) => {
  try {
    return await sql`
    SELECT owner_id as user_id,'editor' as role from spreadsheets WHERE spreadsheet_id = ${spreadsheetId}
    UNION
    SELECT user_id,role from Sheet_access WHERE sheet_id = ${spreadsheetId}
    `;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const fetchSheets = async (spreadsheetId) => {
  return sql`
    SELECT * FROM sheets
    WHERE spreadsheet_id = ${spreadsheetId}`;
};

export const searchSpreadsheetsByNames = async (
  userId,
  searchQuery,
  offset,
  limit
) => {
  try {
    return await sql`
    SELECT s.*, u.name AS owner_name
    FROM spreadsheets s
    JOIN "users" u ON s.owner_id = u.user_id
    WHERE s.owner_id = ${userId}
    AND (s.spreadsheet_name ILIKE '%' || ${searchQuery} || '%' 
         OR s.description ILIKE '%' || ${searchQuery} || '%')
    UNION
    SELECT s.*, u.name AS owner_name
    FROM spreadsheets s
    JOIN sheet_access sa ON sa.sheet_id = s.spreadsheet_id
    JOIN "users" u ON s.owner_id = u.user_id
    WHERE sa.user_id = ${userId} AND sa.wants = TRUE
    AND (s.spreadsheet_name ILIKE '%' || ${searchQuery} || '%' 
         OR s.description ILIKE '%' || ${searchQuery} || '%')
    ORDER BY last_edited_at DESC
    LIMIT ${limit} OFFSET ${offset};
    `;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSpreadsheetCount = async (userId, searchQuery) => {
  try {
    const result = await sql`
    SELECT SUM(count) AS total_count FROM (
      SELECT COUNT(*) AS count
      FROM spreadsheets s
      JOIN "users" u ON s.owner_id = u.user_id
      WHERE s.owner_id = ${userId}
      AND (s.spreadsheet_name ILIKE '%' || ${searchQuery} || '%' 
           OR s.description ILIKE '%' || ${searchQuery} || '%')
      UNION ALL
      SELECT COUNT(*) AS count
      FROM spreadsheets s
      JOIN sheet_access sa ON sa.sheet_id = s.spreadsheet_id
      JOIN "users" u ON s.owner_id = u.user_id
      WHERE sa.user_id = ${userId}
      AND (s.spreadsheet_name ILIKE '%' || ${searchQuery} || '%' 
           OR s.description ILIKE '%' || ${searchQuery} || '%')
    ) AS counts;
    `;
    return result[0].total_count || 0; // Return 0 if no rows are found
  } catch (err) {
    console.log(err);
    throw err;
  }
};
