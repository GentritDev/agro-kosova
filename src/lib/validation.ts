import { z } from "zod";
import { categories, kosovoCities, units } from "@/lib/constants";
import { phoneSchema } from "@/lib/phone";

export const pinSchema = z.string().regex(/^\d{6}$/, "PIN-i duhet të ketë saktësisht 6 shifra");
export const registerSchema = z.object({ name: z.string().trim().min(2, "Shkruani emrin").max(80), phone: phoneSchema, pin: pinSchema, role: z.enum(["FARMER", "BUSINESS"]), city: z.enum(kosovoCities), businessName: z.string().trim().max(120).optional() }).superRefine((value, context) => { if (value.role === "BUSINESS" && !value.businessName) context.addIssue({ code: "custom", path: ["businessName"], message: "Shkruani emrin e biznesit" }); });
export const loginSchema = z.object({ phone: phoneSchema, pin: pinSchema });
const decimal = z.string().trim().regex(/^\d+(\.\d{1,2})?$/, "Shkruani numër pozitiv me deri dy shifra dhjetore").refine((value) => Number(value) > 0, "Vlera duhet të jetë më e madhe se zero");
export const productSchema = z.object({ name: z.string().trim().min(2, "Shkruani emrin e produktit").max(100), description: z.string().trim().min(10, "Përshkrimi duhet të ketë së paku 10 karaktere").max(2000), category: z.enum(categories), unit: z.enum(units), quantityAvailable: decimal, pricePerUnit: decimal, minOrderQuantity: z.union([decimal, z.literal("")]).transform((value) => value || null), city: z.enum(kosovoCities), harvestDate: z.string().date("Zgjidhni datën e vjeljes"), imageUrls: z.array(z.string().url()).min(1, "Ngarkoni së paku një foto").max(3) });
export const inquirySchema = z.object({ productId: z.string().cuid(), quantity: decimal, message: z.string().trim().max(500).optional() });
