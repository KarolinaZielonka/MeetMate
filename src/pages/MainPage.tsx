import { Link } from "react-router-dom";
import Header from "../components/Header";
import React, { ChangeEvent } from "react";
import DateInput from "../components/DateInput";
import { useModeStore } from "../stores/StatePickerStore";

export default function App() {
  const [showModal, setShowModal] = React.useState(false);
  const { calendarRange, setCalendarRange } = useModeStore();
  
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
    // depending on the type, set the start or end date
    setCalendarRange(e.target.value, type);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen flex-col">
        <Header />
        <div className="w-full m-6">
          <p className="font-semibold">Do you have a code?</p>
          <input
            type="text"
            id="small-input"
            className="block w-1/2 m-auto my-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-white sm:text-xs"
          />

          <p className="font-semibold">or create a new one</p>
          <button
            className="block w-1/2 m-auto my-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-white sm:text-xs"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Create a new one
          </button>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-center p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h5 className="text-3xl font-semibold">
                    Pick the dates between which you want to create a new event
                  </h5>
                </div>
                <DateInput
                  label="Select a start date"
                  value={calendarRange.start}
                  onChange={(event) => handleDateChange(event, "start")}
                />
                <DateInput
                  label="Select a end date"
                  value={calendarRange.end}
                  onChange={(event) => handleDateChange(event, "end")}
                />

                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Back to main page
                  </button>
                  <Link
                    to={`calendar/12345`}
                    className="block w-1/2 m-auto my-4 p-2 text-gray-900 border border-gray-300 rounded-lg bg-white sm:text-xs"
                  >
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
