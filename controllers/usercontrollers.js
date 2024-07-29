const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { body, validationResult } = require('express-validator');

const { MailtrapClient } = require("mailtrap");
const crypto = require('crypto');

const TOKEN = process.env.SMTP_PASS;
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.DOMAIN}/resetPassword/${token}`;
        const recipients = [
            {
                email: user.email,
            }
        ];

        await client.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Request",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            category: "Password Reset",
        });

        res.send('Password reset email sent');
    } catch (error) {
        console.error(error, "forgotPassword error");
        res.status(500).send('An error occurred');
    }
};

exports.resetPassword = async (req, res) => {
    console.log(req.body, "req.body resetPassword");
    try {
        const user = await User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            res.status(404).send('Password reset token is invalid or has expired');
            return;
        }

        console.log(user, "user");
     
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.verificationCode = undefined;
        await user.save();

        res.redirect('/login');
    } catch (error) {
        console.log(error, "resetPassword error");
        res.status(500).send('An error occurred');
    }
};


exports.login = [
    // Input validation
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  
    async (req, res) => {
      console.log(req.body, "req.body login");
  
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      try {
          const user = await User.findOne({ email: req.body.email });
          if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
              return res.status(401).send('Invalid email or password');
          }
  
          console.log(user, "user");
  
          req.session.userId = user._id; // Save user ID or other relevant info in the session
            req.session.isLoggedIn = true;
            console.log(req.session, "req.session");
  
          // Send success response
          res.status(200).send('Login successful');
      } catch (error) {
          // Send error response
          console.error(error, "login error");
          res.status(500).send('An internal server error occurred');
      }
    }
  ];

  exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
          res.status(500).send('An error occurred');
          return;
      }
      res.redirect('/login');
    });
  }
exports.signup = async (req, res) => {

    console.log(req.body , "req.body");
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.log(error,"signup error");
        res.status(500).send('An error occurred');
    }
};



