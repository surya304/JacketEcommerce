// Assuming express-validator is installed for validation
const { body, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const userController = require('../controllers/userController'); // Assuming this exists



// Validation middleware
const userValidationRules = () => {
  return [
    // email must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 })
  ];
};

// Error handling middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  
  return res.status(422).json({
    errors: extractedErrors,
  });
};

// Login POST request
router.post('/login', userValidationRules(), validate, userController.login);

// Signup POST request
router.post('/signup', userController.signup);

// Forgot Password POST request
router.post('/forgotpassword', userValidationRules(), validate, userController.forgotPassword);

// Reset Password POST request
router.post('/resetpassword', userValidationRules(), validate, userController.resetPassword);






module.exports = router;