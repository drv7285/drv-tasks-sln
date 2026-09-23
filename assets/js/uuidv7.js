/**
 * UUID v7 Generator (RFC 9562)
 * Time-ordered, collision-free UUID implementation in Pure JavaScript.
 */
function generateUuidV7() {
  const now = Date.now();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit timestamp (Big-endian)
  bytes[0] = (now / 0x10000000000) & 0xff;
  bytes[1] = (now / 0x100000000) & 0xff;
  bytes[2] = (now / 0x1000000) & 0xff;
  bytes[3] = (now / 0x10000) & 0xff;
  bytes[4] = (now / 0x100) & 0xff;
  bytes[5] = now & 0xff;

  // Version 7: 0111xxxx
  bytes[6] = 0x70 | (bytes[6] & 0x0f);

  // Variant RFC 4122/9562: 10xxxxxx
  bytes[8] = 0x80 | (bytes[8] & 0x3f);

  return [...bytes].map((b, i) => ([4, 6, 8, 10].includes(i) ? '-' : '') + b.toString(16).padStart(2, '0')).join('');
}

// Support CommonJS export if used in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateUuidV7 };
}
