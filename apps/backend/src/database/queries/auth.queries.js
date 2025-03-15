import { sql } from "../database.js";

export const createUser = async (name, email, password, profile_icon) => {
  const user = await sql`
    INSERT INTO  users (name, email, password, profile_icon)
    VALUES (${name},${email},${password},${profile_icon})
    RETURNING user_id, name, email, profile_icon
    `;
  return user[0];
};

export const createSession = async (
  user_id,
  access_token,
  refresh_token,
  session_time
) => {
  try {
    const session = await sql`
    INSERT INTO sessions (user_id, access_token,refresh_token,session_created_at)
    VALUES (${user_id},${access_token},${refresh_token},${session_time})
    RETURNING session_id,user_id
    `;
    return session[0];
  } catch (err) {
    console.error("Session error", err);
    throw new Error(err);
  }
};

export const findUserbyEmail = async (email) => {
  try {
    return await sql`
    SELECT * FROM users WHERE email = ${email}
    `;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteUserById = async (user_id) => {
  try {
    return await sql`
    DELETE FROM users WHERE user_id = ${user_id}
    RETURNING user_id,name,email
    `;
  } catch (err) {
    throw new Error(err);
  }
};

export const findSessionByAccessToken = async (access_token) => {
  try {
    const session = await sql`
    SELECT session_id,user_id FROM sessions WHERE access_token = ${access_token}
    `;
    return session[0];
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteSessionById = async (session_id) => {
  try {
    return await sql`
    DELETE FROM sessions WHERE session_id = ${session_id}
    RETURNING session_id,user_id
    `;
  } catch (err) {
    throw new Error(err);
  }
};
