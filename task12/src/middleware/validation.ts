import { body, validationResult, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export { body, query };

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role')
    .optional()
    .isIn(['OWNER', 'GUEST', 'ADMIN'])
    .withMessage('Invalid role'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const roomValidation = [
  body('name').notEmpty().withMessage('Room name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'])
    .withMessage('Invalid status'),
];

export const bookingValidation = [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  body('checkIn')
    .isISO8601()
    .withMessage('Valid check-in date is required')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Check-in date must be in the future');
      }
      return true;
    }),
  body('checkOut')
    .isISO8601()
    .withMessage('Valid check-out date is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
];

export const roomFilterValidation = [
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('minCapacity').optional().isInt({ min: 1 }),
  query('maxCapacity').optional().isInt({ min: 1 }),
  query('checkIn').optional().isISO8601(),
  query('checkOut').optional().isISO8601(),
];

