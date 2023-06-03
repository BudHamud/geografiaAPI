import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import cloudinary from "cloudinary";
import { Server as SocketServer } from "socket.io"; // Importa el módulo 'Server' de 'socket.io'
import "./src/config/dbConfig.js";
import "./src/config/cloudinary.js";
import commentModel from "./src/dao/models/comment.model.js";

const app = express();
const port = 8080;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

// Conectarse a la base de datos MongoDB

// Definir el esquema de la publicación
const postSchema = new mongoose.Schema({
  content: String,
});

// Definir el modelo de la publicación
const postModel = mongoose.model("posts", postSchema);

// Configurar middleware para manejar el cuerpo de la solicitud como JSON
app.use(express.json());

// Ruta para guardar una nueva publicación
app.post("/api/posts", async (req, res) => {
  const content = req.body.content;

  const newPost = await postModel.create({ content });

  newPost
    .save()
    .then(() => {
      console.log("Publicación guardada en la base de datos");
      res.status(201).json({ message: "Publicación guardada" });
    })
    .catch((error) => {
      console.error("Error al guardar la publicación", error);
      res.status(500).json({ error: "Error al guardar la publicación" });
    });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se ha proporcionado ninguna imagen" });
  } else {
    const path = req.file.path;

    cloudinary.uploader.upload(path, (result, error) => {
      if (error) {
        console.error("Error al subir la imagen a Cloudinary", error);
        res.status(500).json({ error: "Error al subir la imagen" });
      } else {
        const imageUrl = result.secure_url;
        res.status(200).json({ imageUrl });
      }
    });
  }
});

app.post("/api/comments", async (req, res) => {
  const { postId, text } = req.body;

  try {
    const comment = await commentModel.create({ postId, text });
    await postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );

    // Emitir el evento 'newComment' a todos los clientes conectados
    io.emit("newComment", comment);

    res.json(comment);
  } catch (error) {
    console.error("Error al agregar el comentario", error);
    res.status(500).json({ error: "Error al agregar el comentario" });
  }
});

app.get("/api/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await commentModel.find({ postId });
    res.json(comments);
  } catch (err) {
    console.error("Error al obtener los comentarios", err);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
});

app.get("/api/posts", async (req, res) => {
  const posts = await postModel.find();
  res.json(posts);
});

// Iniciar el servidor
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

const io = new SocketServer(server);