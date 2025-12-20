# Mini Room Reservation System

A fully functional backend system for managing room reservations with role-based access control.

## Features

- **Role-Based Access Control**: Owners, Guests, and Administrators
- **Room Management**: Create, update, and manage rooms
- **Booking System**: Make, view, and cancel bookings
- **Availability Checking**: Prevents overlapping bookings
- **Filtering**: Filter rooms by price and capacity
- **Admin Dashboard**: Comprehensive overview of all data
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-room-reservation-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and JWT secret:
```
DATABASE_URL="postgresql://user:password@localhost:5432/room_reservation?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
```

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Rooms (Public)
- `GET /api/rooms` - Get all available rooms (with filters)
- `GET /api/rooms/:id` - Get room by ID

### Rooms (Owner)
- `GET /api/rooms/owner/my-rooms` - Get owner's rooms with bookings
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update room details

### Bookings (Guest)
- `GET /api/bookings` - Get guest's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id/cancel` - Cancel a booking

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/rooms` - Get all rooms
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status

## Database Models

### User
- id, email, password, name, role (OWNER/GUEST/ADMIN)
- createdAt, updatedAt

### Room
- id, name, description, price, capacity, status
- ownerId (foreign key)
- createdAt, updatedAt

### Booking
- id, checkIn, checkOut, status (PENDING/CONFIRMED/CANCELLED)
- guestId, roomId (foreign keys)
- createdAt, updatedAt

## Features Implementation

âœ… Role-based access control
âœ… Room creation and management by owners
âœ… Booking creation and cancellation by guests
âœ… Overlapping booking prevention
âœ… Room availability filtering by date range
âœ… Price and capacity filtering
âœ… Booking status management
âœ… Admin dashboard endpoints
âœ… Timestamps (createdAt, updatedAt)
âœ… API documentation with Swagger

## Testing

You can test the API using:
- Swagger UI at `/api-docs`
- Postman (import the Swagger spec)
- Any HTTP client

## License

ISC
