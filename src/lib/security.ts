import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;
export const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");
export const generateSessionToken = () => randomBytes(32).toString("base64url");
export const hashIp = (ip: string) => hashToken(ip);
export const hashPin = (pin: string) => bcrypt.hash(pin, 12);
export const verifyPin = (pin: string, hash: string) => bcrypt.compare(pin, hash);
