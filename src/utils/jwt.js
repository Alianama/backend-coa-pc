const jwt = require("jsonwebtoken");

function getTokenPayload(user, withUsername = true) {
  // Payload access token
  let roleName = user.role;
  if (typeof user.role === "object" && user.role !== null) {
    roleName = user.role.name;
  }
  const payload = {
    id: user.id,
    tokenVersion: user.tokenVersion,
    role: roleName,
  };
  if (withUsername && user.username) payload.username = user.username;
  if (user.fullName) payload.fullName = user.fullName;
  if (user.email) payload.email = user.email;
  return payload;
}

function generateAccessToken(user) {
  return jwt.sign(getTokenPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  });
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}

function generateTokens(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  generateTokens,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getTokenPayload,
};
