// routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const validatePost = require('../middlewares/validate'); // Keep require, even if commented out
const { ensureAuth } = require('../middlewares/auth');   // Keep require, even if commented out

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: A list of posts
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      next(err);
    }
  })
  .post(/*ensureAuth, validatePost,*/ async (req, res, next) => { // Commented out middleware
    console.log("POST /post route handler started"); // Logging at start
    console.log("Request body:", req.body); // Log request body
    try {
      const newPost = await Post.create(req.body);
      console.log("Post created successfully:", newPost); // Log success and newPost object
      res.status(201).json(newPost);
    } catch (err) {
      console.error("Error in POST /post route handler:", err); // Error logging
      next(err);
    }
  });

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router
  .route('/:id')
  .put(/*ensureAuth, validatePost,*/ async (req, res, next) => { // Commented out middleware in PUT too
    console.log("PUT /post/:id route handler started, id:", req.params.id); // Logging at start
    console.log("Request body:", req.body); // Log request body
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      console.log("Post updated successfully:", updatedPost); // Log success and updatedPost object
      res.json(updatedPost);
    } catch (err) {
      console.error("Error in PUT /post/:id route handler:", err); // Error logging
      next(err);
    }
  })
  .delete(ensureAuth, async (req, res, next) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;