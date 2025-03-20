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

const BigCalendar = ({ events }: { events: any[] }) => {
  const [view, setView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(moment().startOf("week").toDate());

  // Chuyển đổi ngày và giờ thành một đối tượng Date
  const parseDateTime = (date: string | Date, time: string) => {
  // Chuyển `date` thành đối tượng Date nếu nó là chuỗi
  const parsedDate = moment(date, "YYYY-MM-DD").toDate();

  // Kiểm tra nếu `time` hợp lệ
  const [hours, minutes] = time?.split(":").map(Number) || [0, 0];

  // Trả về đối tượng Date với ngày từ `parsedDate`, giờ từ `time`
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), hours, minutes);
};

  // Xử lý sự kiện lặp lại hàng tuần
  const generateRecurringEvents = () => {
    let allEvents: any[] = [];

    events.forEach((event) => {
      if (event.repeat === "weekly") {
        let startDate = moment(event.startDate);
        let endDate = moment(event.endDate);
        let repeatUntil = moment(event.endDate);

        while (startDate.isBefore(repeatUntil)) {
          if (startDate.isoWeekday() === event.dayOfWeek) {
            allEvents.push({
              title: event.title,
              start: parseDateTime(startDate.toDate(), event.startTime),
              end: parseDateTime(startDate.toDate(), event.endTime),
              teacher: event.teacher,
              link: event.link,
            });
          }
          startDate.add(1, "day");
        }
      } else {
        allEvents.push({
          ...event,
          start: parseDateTime(event.startDate, event.startTime),
          end: parseDateTime(event.startDate, event.endTime),
        });
      }
    });

    return allEvents;
  };

  const allEvents = generateRecurringEvents();

  const handleViewChange = (newView: View, selectedDate?: Date) => {
    if (newView === Views.DAY) {
      setCurrentDate(selectedDate ?? moment().toDate());
    } else if (newView === Views.WEEK) {
      setCurrentDate(moment().startOf("week").toDate());
    }
    setView(newView);
  };

  const CustomEvent = ({ event }: { event: any }) => (
    <div className="flex flex-col justify-center items-center p-1 text-gray-700">
      <div className="text-xs">
        {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
      </div>
      <div className="text-xs font-bold">{event.title}</div>
      <div className="text-xs italic">{event.teacher}</div>
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-xs underline"
        >
          Xem bài giảng
        </a>
      )}
    </div>
  );

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
        <div className="flex items-center gap-1 justify-between md:absolute md:left-1/2 md:-translate-x-1/2">
          <button
            onClick={() => handleNavigate("prev")}
            className="p-2 rounded-l-md bg-gray-200 hover:bg-gray-300"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="font-semibold text-sm">
            {view === Views.WEEK
              ? `${moment(currentDate).startOf("week").format("DD/MM/YYYY")} - ${moment(currentDate).endOf("week").format("DD/MM/YYYY")}`
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
        events={allEvents}
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
