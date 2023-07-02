import { Router } from "express";
import { deletePost, editPost, filterPosts, findPost, getPosts, mostViews, savePost } from "../controller/post.controller.js";

const router = new Router();

// GET api/posts
router.get("/", getPosts);

router.post("/filter", filterPosts);

router.post("/views", mostViews);

// GET api/posts/:id
router.get("/:id", findPost);

// POST api/posts
router.post("/", savePost);

// PUT api/posts/:id
router.put("/:id", editPost);

// DELETE api/posts/:id
router.delete("/:id", deletePost);

export default router;
