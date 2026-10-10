import { describe, expect, it } from "vitest";
import { buildProductWhere } from "../src/lib/products";

describe("buildProductWhere", () => {
  it("builds validated public feed filters", () => { expect(buildProductWhere({ city: "Prishtinë", category: "vegetables", q: "domate" })).toEqual({ status: "ACTIVE", city: "Prishtinë", category: "vegetables", OR: [{ name: { contains: "domate", mode: "insensitive" } }, { description: { contains: "domate", mode: "insensitive" } }] }); });
  it("ignores unsupported filter values", () => expect(buildProductWhere({ city: "Elsewhere", category: "invalid" })).toEqual({ status: "ACTIVE" }));
});
