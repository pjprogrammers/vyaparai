import QRCode from "qrcode";

/**
 * Generate a QR code data URL for a UPI payment link.
 * Works client-side only (uses canvas).
 */
export async function generateUpiQrDataUrl(
  upiId: string,
  amount: number,
  businessName: string,
): Promise<string> {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR`;
  return QRCode.toDataURL(upiUrl, {
    width: 150,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

/**
 * Generate a generic QR code data URL from any string.
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 150,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}
