"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useRef, useEffect } from "react";
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
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const role = localStorage.getItem("role");

  const calendarRef = useRef<HTMLDivElement>(null);

  const parseDateTime = (date: string | Date, time: string) => {
    const parsedDate = moment(date, "YYYY-MM-DD").toDate();
    const [hours, minutes] = time?.split(":").map(Number) || [0, 0];

    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), hours, minutes);
  };

  const generateRecurringEvents = () => {
    let allEvents: any[] = [];

    events.forEach((event) => {
      if (event.repeat === "weekly") {
        let startDate = moment(event.startDate);
        let repeatUntil = moment(event.endDate);

        while (startDate.isBefore(repeatUntil)) {
          if (startDate.isoWeekday() === event.dayOfWeek) {
            allEvents.push({
              title: event.title,
              start: parseDateTime(startDate.toDate(), event.startTime),
              end: parseDateTime(startDate.toDate(), event.endTime),
              teacher: event.teacher,
              room: event.room,
              link: event.link,
              id: event.id,
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
    setView(newView);
    setSelectedEvent(null);
    if (newView === Views.DAY) {
      setCurrentDate(selectedDate ?? moment().toDate());
    } else if (newView === Views.WEEK) {
      setCurrentDate(moment().startOf("week").toDate());
    }
  };

  const handleNavigate = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) =>
      direction === "prev"
        ? moment(prevDate).subtract(1, view === Views.WEEK ? "weeks" : "days").toDate()
        : moment(prevDate).add(1, view === Views.WEEK ? "weeks" : "days").toDate()
    );
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: any, e: any) => {
    e.stopPropagation(); // tránh click lan ra background
    const rect = calendarRef.current?.getBoundingClientRect();
    const clickX = e.clientX - (rect?.left ?? 0);
    const clickY = e.clientY - (rect?.top ?? 0);
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
    setPopupPos({ x: clickX, y: clickY });
  };

  const CustomEvent = ({ event }: { event: any }) => {
    return (
      <div className="flex h-full flex-col justify-center items-center text-gray-700 text-xs font-medium">
        <div className="text-[10px]">
          {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
        </div>
        <div className="font-bold">{event.title}</div>
        <div className="">{event.room}</div>
      </div>
    );
  };

  const EventPopup = () => {
    if (!selectedEvent) return null;

    const popupWidth = 200;
    const popupHeight = 150;

    const calendarWidth = calendarRef.current?.offsetWidth || 0;
    const calendarHeight = calendarRef.current?.offsetHeight || 0;

    const xRightSpace = calendarWidth - popupPos.x;
    const yBottomSpace = calendarHeight - popupPos.y;

    const isRight = xRightSpace > popupWidth;
    const top = yBottomSpace < popupHeight ? popupPos.y - popupHeight + 20 : popupPos.y;

    const style: React.CSSProperties = {
      position: "absolute",
      top,
      left: isRight ? popupPos.x + 10 : popupPos.x - popupWidth - 10,
      width: popupWidth,
      backgroundColor: "white",
      border: "1px solid #ccc",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      padding: "8px",
      zIndex: 100,
      fontSize: "0.75rem",
      borderRadius: 8,
    };

    return (
      <div style={style}>
        <div className="font-semibold">{selectedEvent.title}</div>
        <div>Giảng viên: {selectedEvent.teacher}</div>
        <div>Phòng: {selectedEvent.room}</div>
        {selectedEvent.link && (
          <div className="flex justify-between mt-2 gap-1">
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL_FILE}${selectedEvent.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-sm shadow-md bg-cyan-900 text-white block text-center text-xs w-full"
            >
              Xem bài giảng
            </a>

            <a
              href={`/teacher/students/${selectedEvent.id}`}
              className="p-1 rounded-sm shadow-md bg-cyan-900 text-white block text-center text-xs w-full"
            >
              Danh sách lớp
            </a>
          </div>
        )}
      </div>
    );
  };



  // Đóng popup khi click ngoài lịch
  useEffect(() => {
    const handleClickOutside = () => setSelectedEvent(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="p-4 relative overflow-x-auto" ref={calendarRef}>
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
              className={`cursor-pointer px-3 py-1 rounded-md ${id === view
                ? "text-white bg-cyan-900"
                : "text-cyan-900 bg-gray-200 hover:bg-gray-300"
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
        onSelectEvent={handleSelectEvent}
        onDrillDown={(date) => handleViewChange(Views.DAY, date)}
      />

      <EventPopup />
    </div>
  );
};

export default BigCalendar;
