const prisma = require("../prisma/prismaClient.js");

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email }
  });
}

async function createUser(data) {
  return await prisma.user.create({
    data
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
  });
}

async function createRefreshToken(data) {
  return await prisma.refreshToken.create({
    data
  });
}

async function getRefreshToken(token) {
  return await prisma.refreshToken.findUnique({
    where: { token },
    include: {
      user: true
    }
  });
}

async function deleteRefreshToken(token) {
  return await prisma.refreshToken.deleteMany({
    where: { token }
  });
}

async function deleteUserRefreshTokens(userId) {
  return await prisma.refreshToken.deleteMany({
    where: { userId }
  });
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens
};