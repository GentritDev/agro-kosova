export const digitsOnly = (phone: string) => phone.replace(/\D/g, "");
export const buildContactMessage = (productName: string, quantity: string, unit: string) => `Përshëndetje! Jam i/e interesuar për ${quantity} ${unit} të produktit “${productName}” në AgroKosova. A është ende në dispozicion?`;
export const buildWhatsAppLink = (phone: string, productName: string, quantity: string, unit: string) => `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(buildContactMessage(productName, quantity, unit))}`;
export const buildViberLink = (phone: string) => `viber://chat?number=${digitsOnly(phone)}`;
