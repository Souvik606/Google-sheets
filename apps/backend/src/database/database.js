import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "../../env.js";

const sql = neon(DATABASE_URL);

export { sql };
