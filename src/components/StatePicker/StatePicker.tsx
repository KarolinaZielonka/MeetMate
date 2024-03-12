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
          className={`m-8 p-2 capitalize font-bold text-green ${
            mode === "allow" ? "bg-green" : ""
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
          className={`m-8 p-2 capitalize font-bold text-red ${
            mode === "disallow" ? "bg-red" : ""
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
          className={`m-8 p-2 capitalize font-bold text-gray-800 ${
            mode === "maybe" ? "bg-gray" : ""
          } rounded-md`}
        >
          possible date available
        </label>
      </div>
    </div>
  );
}
