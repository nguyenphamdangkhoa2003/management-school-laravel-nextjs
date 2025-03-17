"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "moment/locale/vi"; 

moment.locale("vi");

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const CustomEvent = ({ event }: { event: any }) => {
    return (
      <div className="w-full h-full flex flex-col justify-center items-start p-1 text-gray-700">
        <div className="text-xs">{moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}</div>
        <div className="text-xs font-bold">{event.title}</div>
      </div>
    );
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={[Views.WEEK, Views.DAY]}
      view={view}
      style={{ height: "70%" }}
      onView={handleOnChangeView}
      min={new Date(2025, 0, 1, 7, 0, 0)}
      max={new Date(2025, 0, 1, 18, 0, 0)}
      formats={{
        weekdayFormat: (date) => moment(date).format("dddd"), 
        dayFormat: (date) => moment(date).format("dddd"),

      }}
      components={{
        event: CustomEvent,
      }}
    />
  );
};

export default BigCalendar;
