import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <Header />
      <div className="w-full m-6">
        <p className="font-semibold">Do you have a code?</p>
        <input
          type="text"
          id="small-input"
          className="block w-1/2 m-auto my-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs"
        />

        <p className="font-semibold">or create a new one</p>
        <Link
          to={`calendar/12345`}
          className="block w-1/2 m-auto my-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs"
        >
          Create
        </Link>
      </div>
    </div>
  );
}
