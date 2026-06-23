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

module.exports = { getUserByEmail, createUser, getUserById };
