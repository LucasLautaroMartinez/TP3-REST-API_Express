const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require("../services/user.service.js");
const  validateBody = require("../validations/body.validation.js");
const userSchema = require("../const/userSchema.js");

async function register(req, res) {
  try {
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
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }
    
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  try {
    res.json({
      message: "Sesión cerrada exitosamente",
      logout: true
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, logout };