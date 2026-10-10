import { describe, expect, it } from "vitest";
import { normalizeKosovoPhone } from "../src/lib/phone";

describe("normalizeKosovoPhone", () => {
  it("normalizes common local formats", () => { expect(normalizeKosovoPhone("044 123 456")).toBe("+38344123456"); expect(normalizeKosovoPhone("+383 49 111 222")).toBe("+38349111222"); expect(normalizeKosovoPhone("0038345123456")).toBe("+38345123456"); });
  it("rejects non-Kosovo and malformed numbers", () => { expect(normalizeKosovoPhone("+35544123456")).toBeNull(); expect(normalizeKosovoPhone("041 123 456")).toBeNull(); expect(normalizeKosovoPhone("044 123")).toBeNull(); });
});
