export const kosovoCities = [
  "Prishtinë", "Prizren", "Pejë", "Gjakovë", "Gjilan", "Ferizaj", "Mitrovicë", "Podujevë", "Vushtrri", "Suharekë", "Rahovec", "Malishevë", "Lipjan", "Kamenicë", "Deçan", "Klinë", "Istog", "Kaçanik", "Shtime", "Dragash"
] as const;

export const categories = ["vegetables", "fruits", "dairy", "meat", "grains", "mushrooms", "other"] as const;
export const units = ["KG", "TON", "PIECE", "LITER"] as const;
export const categoryLabels: Record<(typeof categories)[number], string> = { vegetables: "Perime", fruits: "Fruta", dairy: "Bulmet", meat: "Mish", grains: "Drithëra", mushrooms: "Kërpudha", other: "Të tjera" };
export const unitLabels: Record<(typeof units)[number], string> = { KG: "kg", TON: "ton", PIECE: "copë", LITER: "litër" };
