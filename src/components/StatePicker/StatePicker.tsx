import { useModeStore } from "../../stores/StatePickerStore";
import "../../styles.css";

export default function App() {
  const { mode, setMode } = useModeStore();

  return (
    <div className="flex items-start">
      <div>
        <input
          type="checkbox"
          id="toggleSwitchAllow"
          checked={mode === "allow"}
          onChange={() => {
            setMode("allow");
          }}
          className="hidden"
        />
        <label
          htmlFor="toggleSwitchAllow"
          className={`m-8 p-2 capitalize font-bold text-green-500 ${
            mode === "allow" ? "bg-green-100" : ""
          } rounded-md`}
        >
          available date
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          id="toggleSwitchDisallow"
          checked={mode === "disallow"}
          onChange={() => {
            setMode("disallow");
          }}
          className="hidden"
        />
        <label
          htmlFor="toggleSwitchDisallow"
          className={`m-8 p-2 capitalize font-bold text-red-500 ${
            mode === "disallow" ? "bg-red-100" : ""
          } rounded-md`}
        >
          busy date
        </label>
      </div>
      <div>
        <input
          type="checkbox"
          id="toggleSwitchMaybe"
          checked={mode === "maybe"}
          onChange={() => {
            setMode("maybe");
          }}
          className="hidden"
        />
        <label
          htmlFor="toggleSwitchMaybe"
          className={`m-8 p-2 capitalize font-bold text-gray-500 ${
            mode === "maybe" ? "bg-gray-100" : ""
          } rounded-md`}
        >
          possible date available
        </label>
      </div>
    </div>
  );
}
