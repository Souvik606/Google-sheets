import { NODE_ENV } from "../../env.js";

export const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "None" : "Lax",
};
