// backend/src/utils/password.js
import bcrypt from "bcrypt";

export async function hashPassword(raw) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(raw, salt);
}

export async function comparePassword(raw, hashed) {
  return bcrypt.compare(raw, hashed);
}
