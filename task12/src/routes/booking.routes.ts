import { Router } from 'express';
import {
  createBooking,
  cancelBooking,
  getGuestBookings,
  getBookingById,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';
import { bookingValidation, validate } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the authenticated guest
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of guest bookings
 */
router.get('/', authenticate, authorize('GUEST'), getGuestBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.get('/:id', authenticate, getBookingById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (Guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               roomId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Room not available or overlapping booking
 */
router.post(
  '/',
  authenticate,
  authorize('GUEST'),
  bookingValidation,
  validate,
  createBooking
);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking (Guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id/cancel', authenticate, authorize('GUEST'), cancelBooking);

export default router;

