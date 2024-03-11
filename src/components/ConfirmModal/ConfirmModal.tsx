import React from "react";
import { useEntitiesStore } from "../../stores/EntitiesStore";
import { groupEntitiesByType } from "../../utils";

export default function Modal() {
  const [showModal, setShowModal] = React.useState(false);
  const { entities } = useEntitiesStore();
  const groupedEntities = groupEntitiesByType(entities);

  return (
    <>
      <button
        className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Submit
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-center p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Are you sure you want to submit these changes?
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h6>Possible</h6>
                    <ul>
                      {groupedEntities.allow.map((o) => (
                        <li>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6>Impossible</h6>

                    <ul>
                      {groupedEntities.disallow.map((o) => (
                        <li>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6>Maybe</h6>
                    <ul>
                      {groupedEntities.maybe.map((o) => (
                        <li>{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Back to calendar
                  </button>
                  <button
                    className="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
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
