import { courseData } from './course.data';
import { Course } from './course.entity';

export class CourseRepository {
  private courses: Course[] = [];
  private idCounter = 1;

  constructor(courseDb: Course[] = courseData) {
    // إذا كان courseData يحتوي على بيانات، استخدمها
    this.courses = courseDb;
    this.idCounter = courseDb.length + 1;
  }

  // ميثود للحصول على كل الدورات
  findAll(): Course[] {
    return this.courses;
  }

  // ميثود للبحث عن دورة باستخدام ID
  findById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  // ميثود لإنشاء دورة جديدة
  create(
    title: string,
    description: string,
    createdBy: string,
    image?: string
  ): Course {
    const newCourse: Course = {
      id: this.idCounter.toString(),
      title,
      description,
      createdBy,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.courses.push(newCourse);  // إضافة الدورة إلى المصفوفة
    this.idCounter++;  // زيادة عداد الـ ID
    return newCourse;
  }

  // ميثود لتحديث دورة
  update(id: string, updatedCourse: Partial<Course>): Course | undefined {
    const course = this.courses.find(course => course.id === id);
    if (!course) return undefined;

    // تحديث الدورة
    const index = this.courses.indexOf(course);
    const updatedData: Course = {
      ...course,
      ...updatedCourse,  // دمج البيانات الجديدة مع البيانات القديمة
      updatedAt: new Date(),  // تحديث تاريخ التعديل
    };

    this.courses[index] = updatedData;  // استبدال الدورة القديمة
    return updatedData;
  }

  // ميثود لحذف دورة
  delete(id: string): boolean {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return false;  // الدورة غير موجودة
    this.courses.splice(index, 1);  // حذف الدورة
    return true;
  }
}

// تصدير الريبو
export const courseRepository = new CourseRepository();
