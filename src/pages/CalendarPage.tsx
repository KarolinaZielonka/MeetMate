import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import "react-calendar/dist/Calendar.css";

import MainCalendar from "../components/MainCalendar";

import StatePicker from "../components/StatePicker";

export default function CalendarPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <Header />
      <MainCalendar />
      <StatePicker />
      <ConfirmModal />
    </div>
  );
}
