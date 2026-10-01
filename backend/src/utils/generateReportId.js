const { randomInt } = require("crypto");

// Tanpa 0/O/1/I agar mudah dibaca dan diketik warga
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate unique report ID: ADN-YYYYMMDD-XXXXXX
 * Suffix acak kriptografis (32^6 kemungkinan per hari) agar tidak mudah ditebak.
 */
function generateReportId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `ADN-${year}${month}${day}-${suffix}`;
}

module.exports = generateReportId;
