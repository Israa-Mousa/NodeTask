Course API Test Suite

This repository contains tests for the Course Routes of a REST API. The tests ensure that different roles (COACH, ADMIN, STUDENT) have appropriate access rights and validations for various endpoints.

Features Tested

POST /courses: Create a course (Only COACH/ADMIN can create)

GET /courses: Get all courses (public access)

GET /courses/:id: Get details of a specific course

PUT /courses/:id: Update course (Only course creator can update)

DELETE /courses/:id: Delete course (Only course creator can delete)

Setup
Prerequisites

Node.js (v14 or higher)

npm or yarn

Installation

Clone the repository:

git clone https://github.com/Israa-Mousa/NodeTask.git
cd task7/express-mini


Install dependencies:

npm install

Configuration

Set up environment variables:
Ensure your .env file is set up with the necessary configurations. Here's an example:

JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret


Database setup:
The tests assume you are using a database (like PostgreSQL). Make sure your database is running and configured properly.

Running Tests

Start your application server (if it's not running already).

Run the test suite:

npm run test

Test Details

POST /courses: Ensures that only COACH and ADMIN can create a course.

GET /courses: Verifies that the course list can be accessed by unauthenticated users, and returns a list of courses for authenticated clients.

GET /courses/:id: Tests if a valid course ID returns course details, and an invalid ID returns a 404.

PUT /courses/:id: Ensures only the course creator (COACH/ADMIN) can update the course.

DELETE /courses/:id: Verifies that only the course creator (COACH/ADMIN) can delete a course.

Example of Tests

GET /api/v1/courses (Unauthenticated)

Expected result: 401 Unauthorized

POST /api/v1/courses (COACH can create)

Expected result: 201 Created

POST /api/v1/courses (STUDENT cannot create)

Expected result: 403 Forbidden

GET /api/v1/courses (Returns a list of courses)

Expected result: 200 OK with an array of courses

PUT /api/v1/courses/:id (COACH can update their own course)

Expected result: 200 OK

DELETE /api/v1/courses/:id (COACH can delete their own course)

Expected result: 200 OK

Folder Structure
/tests
  /helper
    supertest.helper.ts  # Setup of test clients and JWT generation
  /courses
    courses.routes.test.ts  # Course API test suite

License

This project is licensed under the MIT License - see the LICENSE
 file for details.

Feel free to modify this according to your specific needs!