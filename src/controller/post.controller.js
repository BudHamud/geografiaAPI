import PostService from "../dao/service/PostService.js";
import { v2 } from "cloudinary";
import { extractPublicIdFromUrl } from "../utils.js";
import postModel from "../dao/models/post.model.js";

const ps = new PostService();

export const getPosts = async (req, res) => {
  const posts = await ps.getPosts();
  res.json(posts);
};

export const filterPosts = async (req, res) => {
  const { search, filter, page, limit } = req.body;

  const posts = await ps.getPosts(search, filter, 'createdAt', page, limit);
  res.json(posts);
};

export const mostViews = async (req, res) => {
  const { search, filter, page, limit } = req.body;

  const posts = await ps.getPosts(search, filter, 'views', page, limit);
  res.json(posts);
};

export const findPost = async (req, res) => {
  try {
    const posts = await postModel.findById(req.params.id);
    res.json(posts);
  } catch (err) {
    console.log(err);
  }
};

export const savePost = async (req, res) => {
  const content = req.body.data;

  try {
    const post = await postModel.create(content);

    res.status(201).json({ message: "Publicación guardada", id: post._id });
  } catch (err) {
    console.error("Error al guardar la publicación", err);
    res.status(500).json({ error: "Error al guardar la publicación" });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const post = await ps.editPost(id, data);
    res.status(200).json({ message: "Publicacion editada", post: post });
  } catch (err) {
    console.error("Error al editar la publicación", err);
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await ps.deletePost(id);
    res.status(200).json({ message: "Publicacion borrada", post: post });
  } catch (err) {
    console.error("Error al borrar la publicación", err);
  }
};

export const uploadImg = (req, res) => {
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
          const cloudinaryResult = await v2.uploader.upload(imagePath, {
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
};

export const deleteImg = async (req, res) => {
  const { imageUrl } = req.body; // URL

  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    await v2.uploader.destroy(`geografia/${publicId}`);
    res
      .status(200)
      .json({ message: "La imagen ha sido eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la imagen de Cloudinary", error);
    res.status(500).json({ error: "Error al eliminar la imagen" });
  }
};
