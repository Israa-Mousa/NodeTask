import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  getAllRooms,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { body, validate } from '../middleware/validation';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/dashboard', getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rooms
 */
router.get('/rooms', getAllRooms);

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */
router.get('/bookings', getAllBookings);

/**
 * @swagger
 * /api/admin/bookings/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: Booking status updated
 */
router.put(
  '/bookings/:id/status',
  [
    body('status')
      .isIn(['PENDING', 'CONFIRMED', 'CANCELLED'])
      .withMessage('Invalid status'),
  ],
  validate,
  updateBookingStatus
);

export default router;

