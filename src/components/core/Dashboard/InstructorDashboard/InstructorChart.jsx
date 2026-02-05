import React, { useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students");

  // Generate random colors only once using useMemo
  const chartColors = useMemo(() => {
    return courses.map(
      () =>
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)})`
    );
  }, [courses]);

  const chartDataStudents = useMemo(() => {
    return {
      labels: courses.map((course) => course.courseName),
      datasets: [
        {
          data: courses.map((course) => course.totalStudentsEnrolled),
          backgroundColor: chartColors,
        },
      ],
    };
  }, [courses, chartColors]);

  const chartIncomeData = useMemo(() => {
    return {
      labels: courses.map((course) => course.courseName),
      datasets: [
        {
          data: courses.map((course) => course.totalAmountGenerated),
          backgroundColor: chartColors,
        },
      ],
    };
  }, [courses, chartColors]);

  const options = {
    maintainAspectRatio: false, // important to fill parent container
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#F1F2FF",
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-y-6 h-full">
      <p className="text-lg font-bold text-[#F1F2FF]">Visualize</p>
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-[#2C333F] text-[#FFD60A]"
              : "text-[#9E8006]"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-[#2C333F] text-[#FFD60A]"
              : "text-[#9E8006]"
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-[220px] w-full">
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  );
}

export default InstructorChart;
