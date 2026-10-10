import { describe, expect, it } from "vitest";
import { generateSessionToken, hashToken, hashPin, verifyPin } from "../src/lib/security";

describe("PIN and session security", () => {
  it("hashes and verifies a six-digit PIN", async () => { const hash = await hashPin("123456"); expect(hash).not.toContain("123456"); await expect(verifyPin("123456", hash)).resolves.toBe(true); await expect(verifyPin("654321", hash)).resolves.toBe(false); });
  it("creates opaque tokens with stable SHA-256 hashes", () => { const token = generateSessionToken(); expect(token).toHaveLength(43); expect(hashToken(token)).toMatch(/^[a-f0-9]{64}$/); expect(hashToken(token)).toBe(hashToken(token)); });
});
