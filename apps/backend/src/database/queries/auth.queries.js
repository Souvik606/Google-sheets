import { sql } from "../database.js";
import bcrypt from "bcryptjs";

export const createUser = async (name, email, password, profile_icon) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await sql`
    INSERT INTO  users (name, email, password, profile_icon)
    VALUES (${name},${email},${hashedPassword},${profile_icon})
    RETURNING user_id, name, email, profile_icon
    `;
    return user[0];
  } catch (err) {
    throw new Error(err);
  }
};

export const createSession = async (user_id, access_token, refresh_token) => {
  try {
    const session = await sql`
    INSERT INTO sessions (user_id, access_token,refresh_token)
    VALUES (${user_id},${access_token},${refresh_token})
    RETURNING session_id,user_id
    `;
    return session[0];
  } catch (err) {
    throw new Error(err);
  }
};

export const findUserbyEmail = async (email) => {
  try {
    return await sql`
    SELECT user_id FROM users WHERE email = ${email}
    `;
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteUserById = async (user_id) => {
  try {
    return await sql`
    DELETE FROM users WHERE user_id = ${user_id}
    `;
  } catch (err) {
    throw new Error(err);
  }
};
