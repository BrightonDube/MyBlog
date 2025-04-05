// routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const validatePost = require('../middlewares/validate');
const { ensureAuth } = require('../middlewares/auth');

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
  .post(/*ensureAuth, validatePost*/, async (req, res, next) => {
    try {
      const newPost = await Post.create(req.body);
      res.status(201).json(newPost);
    } catch (err) {
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
  .put(ensureAuth, validatePost, async (req, res, next) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedPost);
    } catch (err) {
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
