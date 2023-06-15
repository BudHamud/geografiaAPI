import { Router } from "express";
import cloudinary from "cloudinary";
import postModel from "../dao/models/post.model.js";

const router = new Router();

router.get("/", async (req, res) => {
  const posts = await postModel.find();
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  try {
    const posts = await postModel.findById(req.params.id);
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
});

// Ruta para guardar una nueva publicación
router.post("/", async (req, res) => {
  const content = req.body;
  console.log(content);

  try {
    await postModel.create(content);
    console.log("Publicación guardada en la base de datos");
    res.status(201).json({ message: "Publicación guardada" });
  } catch (err) {
    console.error("Error al guardar la publicación", err);
    res.status(500).json({ error: "Error al guardar la publicación" });
  }
});
// POST api/posts
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
          const cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
            folder: "geografia",
          });
          const imageUrl = cloudinaryResult.secure_url;

          res.status(200).json({ imageUrl: imageUrl }); // Asegúrate de devolver la URL en la respuesta
        } catch (error) {
          console.error("Error al subir la imagen a Cloudinary", error);
          res.status(500).json({ error: "Error al subir la imagen" });
        }
      }
    });
  }
});

export default router;
