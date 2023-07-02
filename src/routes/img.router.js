import { Router } from "express";
import { deleteImg, uploadImg } from "../controller/post.controller.js";

const router = new Router()

// POST api/posts
router.post("/upload", uploadImg);

// DELETE api/posts/:id
router.post("/delete", deleteImg);

export default router