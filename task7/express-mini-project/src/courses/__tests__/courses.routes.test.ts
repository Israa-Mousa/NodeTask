import { setupTestClients } from "../../tests/hepler/supertest.helper";
import { CourseRepository } from "../../courses/course.repsitory";
import { faker } from "@faker-js/faker";

describe("Course Routes", () => {
  let clients: any;
  let courseRepository: CourseRepository;
  let createdCourse: any;

  beforeAll(async () => {
    console.log("=== Before All Started ===");
    clients = await setupTestClients();
    console.log("Clients Loaded:", clients);
    courseRepository = new CourseRepository();
  });

  it("GET /api/v1/courses with unauthed agent will throw error", async () => {
    const response = await clients.unAuthedClient.get("/api/v1/courses");
    expect(response.status).toBe(401); 
  });

  it("GET /api/v1/courses should return list of courses for authed client", async () => {
    const response = await clients.authedClient.get("/api/v1/courses");
    expect(response.status).toBe(200); 
    expect(response.body.data).toEqual(expect.any(Array)); 
  });

  it("COACH can create a course", async () => {
    const newCourse = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence({ min: 5, max: 10 }),
      image: "course.jpg",
      createdBy: clients.users.coachUser.id,  
    };

    const res = await clients.authedClient.post("/api/v1/courses").send(newCourse);
    expect(res.status).toBe(201);  
    expect(res.body.data).toMatchObject({
      title: newCourse.title,
      description: newCourse.description,
      createdBy: newCourse.createdBy,
    });

    createdCourse = res.body.data;  
  });

  it("STUDENT cannot create a course", async () => {
    const res = await clients.studentClient.post("/api/v1/courses").send({
      title: "Invalid Course",
      description: "Should fail",
      image: "fail.jpg",
      createdBy: clients.users.studentUser.id,
    });
    expect(res.status).toBe(403);  
  });

  it("Validation error when missing fields", async () => {
    const res = await clients.authedClient.post("/api/v1/courses").send({
      title: "",
      description: "",
    });
    expect(res.status).toBe(400);  
  });

  it("Returns list of all courses", async () => {
    const res = await clients.unAuthedClient.get("/api/v1/courses");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(expect.any(Array));
  });

  it("Returns empty array when no courses exist", async () => {
    await courseRepository.delete(createdCourse.id);  
    const res = await clients.unAuthedClient.get("/api/v1/courses");
    expect(res.body.data).toEqual([]);
  });

  it("Returns 404 for invalid course ID", async () => {
    const res = await clients.unAuthedClient.get("/api/v1/courses/999");
    expect(res.status).toBe(404); 
  });

  it("Course creator (COACH) can update their course", async () => {
    createdCourse = await courseRepository.create(  
      faker.lorem.words(3),
      faker.lorem.sentence({ min: 5, max: 10 }),
      clients.users.coachUser.id,
      "image.jpg"
    );

    const res = await clients.authedClient.put(`/api/v1/courses/${createdCourse.id}`).send({
      title: "Updated Title",
    });
    expect(res.status).toBe(200); 
    expect(res.body.data.title).toBe("Updated Title");
  });

  it("STUDENT cannot update course", async () => {
    const res = await clients.studentClient.put(`/api/v1/courses/${createdCourse.id}`).send({
      title: "Fail Update",
    });
    expect(res.status).toBe(403);  
  });

  it("Course creator (COACH) can delete their course", async () => {
    const res = await clients.authedClient.delete(`/api/v1/courses/${createdCourse.id}`);
    expect(res.status).toBe(200);
  });

  it("STUDENT cannot delete course", async () => {
    const course = await courseRepository.create(
      faker.lorem.words(3),
      faker.lorem.sentence({ min: 5, max: 10 }),
      clients.users.coachUser.id,  
      "image.jpg"
    );

    const res = await clients.studentClient.delete(`/api/v1/courses/${course.id}`);
    expect(res.status).toBe(403);
  });
});
