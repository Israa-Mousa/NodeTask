import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const createRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, capacity, status } = req.body;
    const ownerId = req.user!.id;

    const room = await prisma.room.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        status: status || 'AVAILABLE',
        ownerId,
      },
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const updateRoom = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, capacity, status } = req.body;
    const ownerId = req.user!.id;

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.ownerId !== ownerId) {
      return res.status(403).json({ error: 'Not authorized to update this room' });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(status && { status }),
      },
    });

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room' });
  }
};

export const getRooms = async (req: AuthRequest, res: Response) => {
  try {
    const {
      minPrice,
      maxPrice,
      minCapacity,
      maxCapacity,
      checkIn,
      checkOut,
    } = req.query;

    let where: any = {
      status: 'AVAILABLE',
    };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (minCapacity || maxCapacity) {
      where.capacity = {};
      if (minCapacity) where.capacity.gte = parseInt(minCapacity as string);
      if (maxCapacity) where.capacity.lte = parseInt(maxCapacity as string);
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    let availableRooms = rooms;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn as string);
      const checkOutDate = new Date(checkOut as string);

      availableRooms = await Promise.all(
        rooms.map(async (room) => {
          const overlappingBookings = await prisma.booking.findMany({
            where: {
              roomId: room.id,
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

          return overlappingBookings.length === 0 ? room : null;
        })
      );

      availableRooms = availableRooms.filter((room) => room !== null) as any;
    }

    res.json({
      count: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

export const getRoomById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

export const getOwnerRooms = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user!.id;

    const rooms = await prisma.room.findMany({
      where: { ownerId },
      include: {
        bookings: {
          include: {
            guest: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
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

