import { Router } from 'express';
import {
  createRoom,
  updateRoom,
  getRooms,
  getRoomById,
  getOwnerRooms,
} from '../controllers/room.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
  roomValidation,
  roomFilterValidation,
  validate,
} from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all available rooms with optional filters
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxCapacity
 *         schema:
 *           type: integer
 *       - in: query
 *         name: checkIn
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: checkOut
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of available rooms
 */
router.get('/', roomFilterValidation, validate, getRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */
router.get('/:id', getRoomById);

/**
 * @swagger
 * /api/rooms/owner/my-rooms:
 *   get:
 *     summary: Get all rooms owned by the authenticated owner
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owner's rooms with bookings
 */
router.get('/owner/my-rooms', authenticate, authorize('OWNER'), getOwnerRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room (Owner only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, UNAVAILABLE, MAINTENANCE]
 *     responses:
 *       201:
 *         description: Room created successfully
 */
router.post(
  '/',
  authenticate,
  authorize('OWNER'),
  roomValidation,
  validate,
  createRoom
);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update room details (Owner only)
 *     tags: [Rooms]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, UNAVAILABLE, MAINTENANCE]
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Room not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('OWNER'),
  roomValidation,
  validate,
  updateRoom
);

export default router;

