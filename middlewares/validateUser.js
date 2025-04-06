// middlewares/validateUser.js
const validateUser = (req, res, next) => {
  const { email, password, displayName } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!password && req.method === 'POST') {
    return res
      .status(400)
      .json({ message: 'Password is required for user creation' });
  }
  if (!displayName) {
    return res.status(400).json({ message: 'Display name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password strength validation (example - adjust complexity as needed)
  if (password && password.length < 6) {
    // Example: Minimum password length
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long' });
  }

  next(); // Validation successful
};

module.exports = validateUser;
