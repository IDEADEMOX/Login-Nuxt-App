// import { SignJWT, jwtVerify } from "jose";
import jwt from "jsonwebtoken";

const secretKey = process.env.SESSION_SECRET || "default-secret-key";
// const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(
  payload: Record<string, any>,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d",
) {
  return jwt.sign(payload, secretKey, { expiresIn });
}

export async function decrypt(session: string | undefined = "") {
  try {
    const payload = jwt.verify(session, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}
