<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Admins;
use App\Models\Announcement;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Event;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Guardian;
use App\Models\Lesson;
use App\Models\Result;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Testing\Fakes\Fake;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Admin::create([
            "username" => "admin",
            "password" => Hash::make("12345678"),
        ]);

       // GRADE
for ($i = 1; $i <= 6; $i++) {
    Grade::create([
        "level" => "Năm học 202{$i}-202" . ($i + 4),
    ]);
}


        // SCHOOL CLASS
        for ($i = 1; $i <= 6; $i++) {
            SchoolClass::create([
                "name" => $i . "A",
                "grade_id" => $i,
                "capacity" => rand(50, 80),
            ]);
        }

        // SUBJECTS
        $subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science", "Literature", "English"];
        $subjectIds = [];
        foreach ($subjects as $s) {
            $subject=Subject::create([
                "name" => $s,
                "tin_chi" => rand(1, 3),
                "tin_chi_hoc_phan" => rand(1, 3),
            ]);
            $subjectIds[] = $subject->id;
        }

        //Teacher
        $teacherIds = [];
        for ($i = 0; $i <= 16; $i++) {
            $teacher = Teacher::create([
                "username" => fake()->userName(),
                "name" => fake()->name,
                "surname" => fake()->name,
                "email" => fake()->email,
                "phone" => fake()->phoneNumber,
                "address" => fake()->address,
                "bloodType" => fake()->bloodGroup(),
                "sex" => $i % 2 === 0 ? "MALE" : "FEMALE",
                "img" => fake()->imageUrl(),
                "birthday" => fake()->date(),
                "password" => Hash::make("12345678")          
            ]);
            $teacherIds[] = $teacher->id;
        }
        //subject teacher
           // Assign subjects to teachers via pivot table
           foreach ($teacherIds as $teacherId) {
            $teacherSubjects = array_rand($subjectIds, rand(1, 3)); // Randomly assign 1-3 subjects to each teacher

            // Ensure $teacherSubjects is an array even if a single item is chosen
            if (!is_array($teacherSubjects)) {
                $teacherSubjects = [$teacherSubjects];
            }

            foreach ($teacherSubjects as $subjectId) {
                DB::table('subject_teacher')->insert([
                    'teacher_id' => $teacherId,
                    'subject_id' => $subjectIds[$subjectId],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        

        for ($i = 1; $i <= 6; $i++) {
            SchoolClass::where("id", $i)->update(["supervisor_id" => $i % 16 + 1]);
        }
  
        //Lesson
        for ($i = 0; $i <= 30; $i++) {
            Lesson::create([
                "link" => fake()->word,
                "day" => strtoupper(fake()->dayOfWeek),
                "startTime" => date("Y-m-d H:i:s", strtotime("+1 hour")),
                "endTime" => date("Y-m-d H:i:s", strtotime("+3 hour")),
                "dateStudy" => date("Y-m-d", strtotime("+1 day")),
                "subject_teacher_id" => rand(1, 4),
                "school_class_id" => ($i % 5) + 1,
              
            ]);
        }

        //Parent
        for ($i = 0; $i <= 25; $i++) {
            Guardian::create([
                "username" => fake()->userName(),
                "name" => fake()->name,
                "surname" => fake()->name,
                "email" => fake()->email,
                "phone" => fake()->phoneNumber,
                "address" => fake()->address,
                "password" => Hash::make("12345678"),
                "sex" => $i % 2 === 0 ? "MALE" : "FEMALE",
            ]);
        }

        //Student

        for ($i = 0; $i <= 50; $i++) {
            Student::create([
                "code" => fake()->uuid(),
                "username" => fake()->userName(),
                "name" => fake()->name,
                "surname" => fake()->name,
                "email" => fake()->email,
                "phone" => fake()->phoneNumber,
                "address" => fake()->address,
                "bloodType" => fake()->bloodGroup(),
                "sex" => $i % 2 === 0 ? "MALE" : "FEMALE",
                "img" => fake()->imageUrl(),
                "guardian_id" => $i % 25 + 1,
                "grade_id" => $i % 6 + 1,
                "password" => Hash::make("12345678"),
                "school_class_id" => $i % 6 + 1,
                "birthday" => fake()->dateTime()
            ]);
        }

        // //Exam
        // for ($i = 0; $i <= 10; $i++) {
        //     Exam::create([
        //         "title" => fake()->title,
        //         "startTime" => date("Y-m-d H:i:s", strtotime("+1 hour")),
        //         "endTime" => date("Y-m-d H:i:s", strtotime("+2 hour")),
        //         "lesson_id" => $i % 30 + 1
        //     ]);
        // }

        // //ASSIGNMENT
        // for ($i = 0; $i <= 10; $i++) {
        //     Assignment::create([
        //         "title" => fake()->title,
        //         "startDate" => date("Y-m-d H:i:s", strtotime("+1 hour")),
        //         "dueDate" => date("Y-m-d H:i:s", timestamp: strtotime("+1 day")),
        //         "lesson_id" => $i % 30 + 1
        //     ]);
        // }

        //Result
      // In the DatabaseSeeder.php file, update the Result creation part:

//Result
for ($i = 1; $i <= 50; $i++) {
    Result::create([
        'process_score' => rand(50, 100) / 10,
        'semi_score' => rand(50, 100) / 10,
        'final_scrore' => rand(50, 100) / 10,
        'subject_id' => rand(1, count($subjectIds)),
        'student_id' => rand(1, 50),
    ]);
}


        //ATTENDANCE
        for ($i = 1; $i <= 10; $i++) {
            Attendance::create([
                "date" => now(),
                "present" => true,
                "student_id" => $i,
                "lesson_id" => ($i % 30) + 1,
            ]);
        }

        // //EVENT
        // for ($i = 1; $i <= 5; $i++) {
        //     Event::create([
        //         "title" => fake()->title,
        //         "description" => fake()->realText,
        //         "startTime" => date("Y-m-d H:i:s", strtotime("+1 hour")),
        //         "endTime" => date("Y-m-d H:i:s", strtotime("+2 hour")),
        //         "school_class_id" => ($i % 5) + 1,
        //     ]);
        // }

        //ANOUNCEMENT
        for ($i = 1; $i <= 5; $i++) {
            Announcement::create([
                "title" => fake()->title,
                "description" => fake()->realText,
                "date" => now(),
                "school_class_id" => ($i % 5) + 1,
            ]);
        }
    }
}
