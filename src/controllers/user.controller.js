const bcrypt = require('bcrypt');
const userService = require("../services/user.service.js");
const validateBody = require("../validations/body.validation.js");
const userSchema = require("../const/userSchema.js");

async function register(req, res) {
  const body = req.body;
  
  const { isValid, errors } = validateBody(body, userSchema);
  if (!isValid) {
    return res.status(400).json({ errors });
  }
  
  const existingUser = await userService.getUserByEmail(body.email);
  if (existingUser) {
    return res.status(400).json({ error: "El email ya está registrado" });
  }
  
  const hashedPassword = await bcrypt.hash(body.password, 10);
  
  const user = await userService.createUser({
    email: body.email,
    password: hashedPassword,
    name: body.name
  });
  
  const { password, ...userWithoutPassword } = user;
  res.status(201).json(userWithoutPassword);
}

module.exports = { register };