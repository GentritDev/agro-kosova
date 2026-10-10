import "dotenv/config";
import { hashPin } from "../src/lib/security";
import { prisma } from "../src/lib/db";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Seed nuk lejohet në production.");
  const pinHash = await hashPin("123456");
  const farmer = await prisma.user.upsert({ where: { phone: "+38344123456" }, update: { name: "Blerim Berisha", city: "Rahovec", pinHash, role: "FARMER" }, create: { name: "Blerim Berisha", phone: "+38344123456", pinHash, role: "FARMER", city: "Rahovec" } });
  const business = await prisma.user.upsert({ where: { phone: "+38349111222" }, update: { name: "Arta Krasniqi", city: "Prishtinë", pinHash, role: "BUSINESS", businessName: "Kuzhina e Artës" }, create: { name: "Arta Krasniqi", phone: "+38349111222", pinHash, role: "BUSINESS", city: "Prishtinë", businessName: "Kuzhina e Artës" } });
  await prisma.product.upsert({ where: { id: "seed-domate-rahovec" }, update: { farmerId: farmer.id, name: "Domate të freskëta", description: "Domate të vjela këtë javë nga ferma familjare në Rahovec.", category: "vegetables", unit: "KG", quantityAvailable: "450", pricePerUnit: "0.85", minOrderQuantity: "20", city: "Rahovec", harvestDate: new Date("2026-09-28"), imageUrls: ["/placeholders/perime.svg"], status: "ACTIVE" }, create: { id: "seed-domate-rahovec", farmerId: farmer.id, name: "Domate të freskëta", description: "Domate të vjela këtë javë nga ferma familjare në Rahovec.", category: "vegetables", unit: "KG", quantityAvailable: "450", pricePerUnit: "0.85", minOrderQuantity: "20", city: "Rahovec", harvestDate: new Date("2026-09-28"), imageUrls: ["/placeholders/perime.svg"] } });
  await prisma.product.upsert({ where: { id: "seed-molle-rahovec" }, update: { farmerId: farmer.id, name: "Mollë vendore", description: "Mollë të zgjedhura për markete dhe kuzhina profesionale.", category: "fruits", unit: "KG", quantityAvailable: "700", pricePerUnit: "0.70", minOrderQuantity: "30", city: "Rahovec", harvestDate: new Date("2026-09-22"), imageUrls: ["/placeholders/fruta.svg"], status: "ACTIVE" }, create: { id: "seed-molle-rahovec", farmerId: farmer.id, name: "Mollë vendore", description: "Mollë të zgjedhura për markete dhe kuzhina profesionale.", category: "fruits", unit: "KG", quantityAvailable: "700", pricePerUnit: "0.70", minOrderQuantity: "30", city: "Rahovec", harvestDate: new Date("2026-09-22"), imageUrls: ["/placeholders/fruta.svg"] } });
  await prisma.inquiry.upsert({ where: { id: "seed-inquiry-domate" }, update: { productId: "seed-domate-rahovec", businessId: business.id, quantity: "40", message: "Na duhen për kuzhinën javën tjetër.", status: "OPEN" }, create: { id: "seed-inquiry-domate", productId: "seed-domate-rahovec", businessId: business.id, quantity: "40", message: "Na duhen për kuzhinën javën tjetër." } });
}

main().then(() => prisma.$disconnect()).catch(async (error: unknown) => { console.error(error); await prisma.$disconnect(); process.exitCode = 1; });
