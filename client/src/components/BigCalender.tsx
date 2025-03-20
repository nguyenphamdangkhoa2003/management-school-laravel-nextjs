"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import "moment/locale/vi";
import { ChevronLeft, ChevronRight } from "lucide-react";

moment.locale("vi");

const VIEW_OPTIONS = [
  { id: Views.DAY, label: "Ngày" },
  { id: Views.WEEK, label: "Tuần" },
];

const localizer = momentLocalizer(moment);

interface BigCalendarProps {
  events: { start: Date; end: Date; title: string }[];
}

const BigCalendar = ({ events }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(moment().startOf("week").toDate());

  const handleViewChange = (newView: View, selectedDate?: Date) => {
    if (newView === Views.DAY) {
      setCurrentDate(selectedDate ?? moment().toDate());
    } else if (newView === Views.WEEK) {
      setCurrentDate(moment().startOf("week").toDate());
    }
    setView(newView);
  };

  const CustomEvent = ({ event }: { event: any }) => {
    return (
      <div className="flex w-full h-full flex-col justify-center items-center p-1 text-gray-700">
        <div className="text-xs">
          {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
        </div>
        <div className="text-xs font-bold">{event.title}</div>
      </div>
    );
  };

  const handleNavigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) =>
      direction === "prev"
        ? moment(prevDate).subtract(1, view === Views.WEEK ? "weeks" : "days").toDate()
        : moment(prevDate).add(1, view === Views.WEEK ? "weeks" : "days").toDate()
    );
  };

  return (
    <div className="p-4 relative overflow-x-scroll">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1 justify-between md:absolute md:left-1/2 md:-translate-x-1/2  ">
          <button
            onClick={() => handleNavigate("prev")}
            className="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="font-semibold text-sm">
            {view === Views.WEEK
              ? `${moment(currentDate).startOf("week").format("DD/MM")} - ${moment(currentDate).endOf("week").format("DD/MM")}`
              : moment(currentDate).format("DD/MM/YYYY")}
          </span>
          <button
            onClick={() => handleNavigate("next")}
            className="p-2 rounded-r-md bg-gray-200 hover:bg-gray-300"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="ml-auto flex gap-1">
          {VIEW_OPTIONS.map(({ id, label }) => (
            <span
              key={id}
              onClick={() => handleViewChange(id)}
              className={`cursor-pointer px-3 py-1 rounded-md ${id === view ? "text-white bg-cyan-900" : "text-cyan-900 bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={[Views.WEEK, Views.DAY]}
        view={view}
        date={currentDate}
        style={{ height: 600, minWidth: 800 }}
        min={new Date(2025, 0, 1, 7, 0, 0)}
        max={new Date(2025, 0, 1, 18, 0, 0)}
        toolbar={false}
        formats={{
          weekdayFormat: (date) => moment(date).format("dddd"),
          dayFormat: (date) => moment(date).format("dddd"),
        }}
        components={{
          event: CustomEvent,
        }}
        onDrillDown={(date) => handleViewChange(Views.DAY, date)}
      />
    </div>
  );
};

export default BigCalendar;
