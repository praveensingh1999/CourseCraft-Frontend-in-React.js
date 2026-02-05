import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      if (instructorApiData.length) setInstructorData(instructorApiData);
      if (result) setCourses(result);
      setLoading(false);
    })();
  }, []);

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );

  return (
    <div className="p-6 space-y-6 bg-[#0F141E] min-h-screen">
      {/* Greeting */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[#F1F2FF]">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-[#999DAA]">Let's start something new</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <>
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161D29] rounded-md p-6 text-white">
              <p className="text-sm text-gray-400">Total Courses</p>
              <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
            </div>
            <div className="bg-[#161D29] rounded-md p-6 text-white">
              <p className="text-sm text-gray-400">Total Students</p>
              <p className="mt-2 text-3xl font-semibold">{totalStudents}</p>
            </div>
            <div className="bg-[#161D29] rounded-md p-6 text-white">
              <p className="text-sm text-gray-400">Total Income</p>
              <p className="mt-2 text-3xl font-semibold">Rs. {totalAmount}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-[#161D29] rounded-md p-6 h-[300px] overflow-hidden">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white">
                <p className="text-lg font-bold">Visualize</p>
                <p className="mt-2 text-sm text-gray-400">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="bg-[#161D29] rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-[#F1F2FF]">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-[#FFD60A]">View All</p>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id}>
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3">
                    <p className="text-sm font-medium text-[#F1F2FF]">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-[#838894]">
                      <span>{course.studentsEnroled?.length || 0} students</span>
                      <span>|</span>
                      <span>Rs. {course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-20 rounded-md bg-[#161D29] p-6 py-20 text-center">
          <p className="text-2xl font-bold text-[#F1F2FF]">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-lg font-semibold text-[#FFD60A]">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Instructor;
