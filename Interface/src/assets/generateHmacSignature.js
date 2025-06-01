import CryptoJS from 'crypto-js';

// Your base64-encoded HMAC secret key
const HMAC_SECRET_KEY_BASE64 = 'BagvFPQmNlG3JyfY9iXiBcweGJ55/byjrqXEz55OpBQ=';

// Decode the base64 key to use in CryptoJS
const HMAC_SECRET_KEY = CryptoJS.enc.Base64.parse(HMAC_SECRET_KEY_BASE64);

/**
 * Generates an HMAC SHA-256 signature for API requests.
 *
 * @param {string} method - HTTP method (e.g., 'POST').
 * @param {string} endpoint - API endpoint (e.g., '/clients/batch').
 * @param {string} timestamp - Current Unix timestamp as a string.
 * @param {string} body - JSON stringified request body.
 * @returns {string} - Base64-encoded HMAC signature.
 */
function generateHmacSignature(method, endpoint, timestamp, body) {
    // Construct the message based on the method, endpoint, timestamp, and body
    const message = `${method.toUpperCase()}\n${endpoint}\n${timestamp}\n${body}`;

    // Generate HMAC SHA-256 signature
    const signature = CryptoJS.HmacSHA256(message, HMAC_SECRET_KEY);

    // Encode the signature to Base64
    return CryptoJS.enc.Base64.stringify(signature);
}

export default generateHmacSignature;
