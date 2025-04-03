"use client";

import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getDataChart } from "@/services/api";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const [data, setData] = useState<any>({});
  const [dataCountChart, setDataCountChart] = useState([
    {
      name: "Tổng",
      count: 0,
      fill: "white",
    },
    {
      name: "Nam",
      count: 0,
      fill: "#c3ebfa",
    },
    {
      name: "Nữ",
      count: 0,
      fill: "#fae27c",
    },
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const allData = await getDataChart();
        console.log(">>data>>", allData);
        setData(allData);

        setDataCountChart([
          {
            name: "Tổng",
            count: allData?.counts?.total_students || 0,
            fill: "white",
          },
          {
            name: "Nam",
            count: allData?.counts?.male_students || 0,
            fill: "#c3ebfa",
          },
          {
            name: "Nữ",
            count: allData?.counts?.female_students || 0,
            fill: "#fae27c",
          },
        ]);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard quantity={data?.counts?.total_students || 0} type="student" />
          <UserCard quantity={data?.counts?.total_teachers || 0} type="teacher" />
          <UserCard quantity={data?.counts?.total_parents || 0} type="parent" />
          {/* <UserCard quantity={1} type="staff" /> */}
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart data={dataCountChart} />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
