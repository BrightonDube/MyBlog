// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuth } = require('../middlewares/auth'); // Keep ensureAuth for protected routes (GET, DELETE, PUT - if you want to protect PUT)
const validateUser = require('../middlewares/validateUser'); // We'll create this middleware

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUserPayload' # Define a schema for new user payload
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # Return User schema on success
 *       400:
 *         description: Validation error or bad request
 *       500:
 *         description: Server error
 */
router
  .route('/')
  .get(ensureAuth, async (req, res, next) => { // Keep ensureAuth for GET users (admin only?)
    try {
      const users = await User.find().select('-password'); // Exclude password from response
      res.json(users);
    } catch (err) {
      next(err);
    }
  })
  .post(validateUser, async (req, res, next) => { // Apply validateUser middleware for POST
    try {
      const newUser = await User.create(req.body);
      const userWithoutPassword = newUser.toObject(); // Convert to plain object to remove mongoose methods
      delete userWithoutPassword.password; // Remove password field for security in response
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      if (err.name === 'ValidationError') { // Mongoose validation error
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) { // MongoDB duplicate key error for email
        return res.status(400).json({ message: 'Email address already exists' });
      }
      next(err); // Pass other errors to error handler
    }
  });

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     security:
 *       - cookieAuth: [] # Protect PUT route if needed
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserPayload' # Define schema for update payload
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User' # Return User schema on success
 *       400:
 *         description: Validation error or bad request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router
  .route('/:id')
  .get(ensureAuth, async (req, res, next) => { // Keep ensureAuth for GET user by ID
    try {
      const user = await User.findById(req.params.id).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  })
  .put(ensureAuth, validateUser, async (req, res, next) => { // Apply validateUser for PUT and protect with ensureAuth (if needed)
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true, // Ensure validators are run on update
      }).select('-password'); // Exclude password from updated user
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (err) {
      if (err.name === 'ValidationError') { // Mongoose validation error
        return res.status(400).json({ message: 'Validation error', errors: err.errors });
      } else if (err.code === 11000 && err.keyPattern && err.keyPattern.email) { // MongoDB duplicate key error for email
        return res.status(400).json({ message: 'Email address already exists' });
      }
      next(err);
    }
  })
  .delete(ensureAuth, async (req, res, next) => { // Keep ensureAuth for DELETE user
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  });

module.exports = router;