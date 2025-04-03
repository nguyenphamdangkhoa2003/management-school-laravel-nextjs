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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [dataCountChart, setDataCountChart] = useState([
    { name: "Tổng", count: 0, fill: "white" },
    { name: "Nam", count: 0, fill: "#c3ebfa" },
    { name: "Nữ", count: 0, fill: "#fae27c" },
  ]);

  const [dataAttendanceChart, setDataAttendanceChart] = useState([
    { name: "Mon", present: 0, absent: 0 },
  ]);

  useEffect(() => {
    const getData = async () => {
      try {
        const allData = (await getDataChart()) || { counts: {}, attendance_trends: [] };

        setData(allData);
        setDataCountChart([
          { name: "Tổng", count: allData?.counts?.total_students || 0, fill: "white" },
          { name: "Nam", count: allData?.counts?.male_students || 0, fill: "#c3ebfa" },
          { name: "Nữ", count: allData?.counts?.female_students || 0, fill: "#fae27c" },
        ]);

        const dataAtd =
          allData?.attendance_trends?.map((item: any) => ({
            name: item.day || `T ${item.month}`,
            current_year: item.current_year || 0,
            previous_year: item.previous_year || 0,
          })) || [];

        setDataAttendanceChart(dataAtd);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-xl font-bold">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard quantity={data?.counts?.total_students ?? "Loading..."} type="Sinh Viên" />
          <UserCard quantity={data?.counts?.total_teachers ?? "Loading..."} type="Giảng viên" />
          <UserCard quantity={data?.counts?.total_parents ?? "Loading..."} type="Phụ huynh" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart data={dataCountChart} />
          </div>

          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart data={dataAttendanceChart} />
          </div>
        </div>

        {/* BOTTOM CHART */}
        {/* <div className="w-full h-[500px]">
          <FinanceChart />
        </div> */}
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
