import { body, param, validationResult } from "express-validator";

// Reusable middleware to catch and return validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg, // Sends the first clean error message
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for Register
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("termsAccepted")
    .custom((val) => val === "true" || val === true)
    .withMessage("You must accept the terms and conditions"),

  validate
];

// Validation rules for Login
export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validate
];

// Validation rules for ID in params (e.g. /user/:id)
export const idValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  validate
];
