// CORS

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

module.exports = allowedOrigins;
