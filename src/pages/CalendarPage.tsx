import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
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
