const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const validate = require('../middlewares/validate');
const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});
/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *
 *   post:
 *     summary: Create a post
 *     tags: [Post]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog
 *               content:
 *                 type: string
 *                 example: This is a post about how to build a Node.js app.
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation failed
 */


/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 */
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a post
 *     tags: [Post]
 */
router.post('/', validate(postSchema), async (req, res, next) => {
  try {
    const post = new Post({ ...req.body, userId: req.user._id });
    await post.save();
    res.status(201).json(post);
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
 */
router.put('/:id', validate(postSchema), async (req, res, next) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;