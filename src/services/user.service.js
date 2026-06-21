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

module.exports = { getUserByEmail, createUser };