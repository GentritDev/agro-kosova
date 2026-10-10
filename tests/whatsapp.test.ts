import { describe, expect, it } from "vitest";
import { buildViberLink, buildWhatsAppLink } from "../src/lib/whatsapp";

describe("contact link builders", () => {
  it("uses digits-only phone and encoded Albanian message for WhatsApp", () => { const url = buildWhatsAppLink("+383 44 123 456", "Domate të freskëta", "50", "kg"); expect(url).toContain("https://wa.me/38344123456?text="); expect(decodeURIComponent(url)).toContain("Domate të freskëta"); expect(decodeURIComponent(url)).toContain("50 kg"); });
  it("uses digits-only phone for Viber", () => expect(buildViberLink("+383 44 123 456")).toBe("viber://chat?number=38344123456"));
});
