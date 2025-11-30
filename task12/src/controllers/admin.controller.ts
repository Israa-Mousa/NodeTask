import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalRooms = await prisma.room.count();
    const totalBookings = await prisma.booking.count();
    const activeBookings = await prisma.booking.count({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });

    const bookingsByStatus = await prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    });

    const roomsByStatus = await prisma.room.groupBy({
      by: ['status'],
      _count: true,
    });

    res.json({
      overview: {
        totalUsers,
        totalRooms,
        totalBookings,
        activeBookings,
      },
      usersByRole,
      bookingsByStatus,
      roomsByStatus,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            rooms: true,
            bookings: true,
          },
        },
      },
    });

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    res.json({
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
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

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
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
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

