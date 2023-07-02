import express from "express";
import cors from "cors";
import fileUpload from 'express-fileupload'
import posts from './src/routes/post.router.js'
import imgs from './src/routes/img.router.js'
import "./src/config/dbConfig.js";
import "./src/config/cloudinary.js";

const app = express();
const port = 8080;

// Configurar middleware para manejar el cuerpo de la solicitud como JSON
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/api/posts', posts)
app.use('/api/img', imgs)

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});