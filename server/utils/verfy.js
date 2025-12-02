import 'dotenv/config';

console.log("Client ID:", process.env.ANGEL_CLIENT_CODE);
console.log("Password:", process.env.ANGEL_PASSWORD);
console.log("API Key:", process.env.ANGEL_API_KEY);
console.log("TOTP Secret:", process.env.ANGEL_TOTP_SECRET);
