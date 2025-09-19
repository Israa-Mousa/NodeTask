"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRepository = exports.CourseRepository = void 0;
var CourseRepository = /** @class */ (function () {
    function CourseRepository() {
        this.courses = [
            {
                id: '1',
                title: 'Node.js',
                description: 'Description for Node.js',
                createdBy: '1',
                // image: 'course1.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                title: 'Express',
                description: 'Description Express',
                createdBy: '2',
                // image: 'course2.jpg',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
    }
    CourseRepository.prototype.findAll = function () {
        return this.courses;
    };
    CourseRepository.prototype.findById = function (id) {
        return this.courses.find(function (course) { return course.id === id; });
    };
    CourseRepository.prototype.create = function (course) {
        this.courses.push(course);
        return course;
    };
    CourseRepository.prototype.update = function (id, updatedCourse) {
        var index = this.courses.findIndex(function (course) { return course.id === id; });
        if (index === -1)
            return undefined;
        this.courses[index] = updatedCourse;
        return updatedCourse;
    };
    CourseRepository.prototype.delete = function (id) {
        var index = this.courses.findIndex(function (course) { return course.id === id; });
        if (index === -1)
            return false;
        this.courses.splice(index, 1);
        return true;
    };
    return CourseRepository;
}());
exports.CourseRepository = CourseRepository;
exports.courseRepository = new CourseRepository();
