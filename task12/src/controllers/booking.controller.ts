import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    const guestId = req.user!.id;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.status !== 'AVAILABLE') {
      return res.status(400).json({ error: 'Room is not available' });
    }

    const overlappingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          not: 'CANCELLED',
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } },
            ],
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } },
            ],
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        error: 'Room is already booked for the selected dates',
      });
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        guestId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        status: 'PENDING',
      },
      include: {
        room: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const guestId = req.user!.id;

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.guestId !== guestId) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        room: true,
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

export const getGuestBookings = async (req: AuthRequest, res: Response) => {
  try {
    const guestId = req.user!.id;

    const bookings = await prisma.booking.findMany({
      where: { guestId },
      include: {
        room: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (
      userRole !== 'ADMIN' &&
      booking.guestId !== userId &&
      booking.room.ownerId !== userId
    ) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

