import { Router } from "express";
import cloudinary from "cloudinary";
import commentModel from "../dao/models/comment.model.js";
import postModel from '../dao/models/post.model.js'

const router = new Router();

router.get("/", async (req, res) => {
  const posts = await postModel.find().populate('comments');
  res.json(posts);
});

// Ruta para guardar una nueva publicación
router.post("/", async (req, res) => {
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

router.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ error: "No se ha proporcionado ninguna imagen" });
  } else {
    const imageFile = req.files.image;

    const imagePath = `uploads/${imageFile.name}`;

    imageFile.mv(imagePath, async (error) => {
      if (error) {
        console.error("Error al guardar la imagen", error);
        res.status(500).json({ error: "Error al guardar la imagen" });
      } else {
        try {
          const cloudinaryResult = await cloudinary.uploader.upload(imagePath, { folder: "geografia" });
          const imageUrl = cloudinaryResult.secure_url;

          res.status(200).json({ imageUrl });
        } catch (error) {
          console.error("Error al subir la imagen a Cloudinary", error);
          res.status(500).json({ error: "Error al subir la imagen" });
        }
      }
    });
  }
});

router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await commentModel.find({ postId });

    if (comments.length > 0) {
      res.json(comments);
    } else {
      // Mantener la solicitud abierta hasta que haya nuevos comentarios o hasta que expire un tiempo de espera
      const timeout = setTimeout(() => {
        res.json([]);
      }, 30000); // 30 segundos de tiempo de espera

      const interval = setInterval(async () => {
        const newComments = await commentModel.find({ postId });

        if (newComments.length > comments.length) {
          clearTimeout(timeout);
          clearInterval(interval);
          res.json(newComments);
        }
      }, 1000); // Consultar nuevos comentarios cada segundo
    }
  } catch (err) {
    console.error("Error al obtener los comentarios", err);
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
});

export default router;
