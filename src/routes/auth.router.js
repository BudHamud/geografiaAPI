import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { comparePasswords, generateToken, hashPassword } from "../utils.js";
import config from "../config/config.js";

const router = new Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username: username });
  if (user) {
    const passwordMatch = await comparePasswords(password, user.password);
    console.log(passwordMatch);
    if (passwordMatch) {
      const token = generateToken(user);
      return res.json({ token: token, message: "Sesión iniciada con exito" });
    } else {
        return res.json({ message: "Usuario o contraseña inválida" })
    }
  }

  return res.status(401).json({ error: "Usuario o contraseña inválida" });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ username: username });

    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya existe" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new userModel({
      username: username,
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  return res
    .status(200)
    .json({ message: "El usuario cerró sesión exitosamente" });
});

router.post("/check-token", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, config.secretJwt);

    const user = await userModel.findById(decoded.id);

    if (user) {
      return res.json({ valid: true });
    }
  } catch (error) {
    console.log("Error al verificar el token:", error);
  }

  return res.json({ valid: false });
});

export default router;
