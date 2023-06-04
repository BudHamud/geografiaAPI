import express from "express";
import cors from "cors";
import fileUpload from 'express-fileupload'
import commentModel from "./src/dao/models/comment.model.js";
import postModel from './src/dao/models/post.model.js'
import posts from './src/routes/post.router.js'
import "./src/config/dbConfig.js";
import "./src/config/cloudinary.js";

const app = express();
const port = 8080;

// Configurar middleware para manejar el cuerpo de la solicitud como JSON
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/posts', posts)

app.post("/api/comments", async (req, res) => {
  const { postId, text } = req.body;

  try {
    const comment = await commentModel.create({ postId, text });
    await postModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );

    res.json(comment);
  } catch (error) {
    console.error("Error al agregar el comentario", error);
    res.status(500).json({ error: "Error al agregar el comentario" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});