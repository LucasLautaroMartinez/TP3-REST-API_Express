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
      return res.status(409).json({ error: "El email ya está registrado" });
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
    
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    await userService.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // en 7 días
      )
    });
    
    res.json({
      accessToken,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: error.message });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await userService.deleteRefreshToken(
        refreshToken
      );
    }

    res.json({
      message: "Sesión cerrada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

async function getMe(req, res) {
  try {
    // req.user viene del middleware authenticateToken
    const user = await userService.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({ error: error.message });
  }

}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token requerido" });
    }

    const storedToken = await userService.getRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(403).json({ error: "Refresh token inválido" });
    }

    if (storedToken.expiresAt < new Date()) {
      await userService.deleteRefreshToken(refreshToken);

      return res.status(403).json({ error: "Refresh token expirado" });
    }

    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        await userService.deleteRefreshToken(refreshToken);

        return res.status(403).json({
          error: "Refresh token expirado"
        });
      }

      return res.status(403).json({
        error: "Refresh token inválido"
      });
    }

    const accessToken = jwt.sign(
      {
        id: storedToken.user.id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m"
      }
    );

    res.json({
      accessToken
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { register, login, logout, getMe, refresh };