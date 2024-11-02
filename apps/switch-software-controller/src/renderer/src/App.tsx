import type React from "react";
import { BsController } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import { FaUsb } from "react-icons/fa";

function App(): React.JSX.Element {
  const videoElementId = "camera";
  return (
    <div className="h-dvh bg-surface">
      <div className="flex h-dvh">
        <div className="flex flex-1 flex-col text-on-surface">
          <video id={videoElementId} autoPlay className="w-full p-2" />
          <div className="flex h-full w-full">
            <div className="flex flex-1 flex-col gap-4 p-2">
              <div className="flex gap-2">
                <CiVideoOn />
                <select className="flex-1 bg-surface-dim">
                  <option>Video1</option>
                  <option>Video2</option>
                  <option>Video3</option>
                </select>
                <button className="rounded-md bg-primary px-2 text-on-primary">
                  Connect
                </button>
              </div>
              <div className="flex gap-2">
                <FaUsb />
                <select className="flex-1 bg-surface-dim">
                  <option>USB1</option>
                  <option>USB2</option>
                  <option>USB3</option>
                </select>
                <button className="rounded-md bg-primary px-2 text-on-primary">
                  Connect
                </button>
              </div>
              <div className="flex gap-2">
                <BsController />
                <select className="flex-1 bg-surface-dim">
                  <option>Controller1</option>
                  <option>Controller2</option>
                  <option>Controller3</option>
                </select>
                <button className="rounded-md bg-primary px-2 text-on-primary">
                  Connect
                </button>
              </div>
            </div>
            <div className="flex flex-1 p-2">Macro</div>
          </div>
        </div>
        <div className="flex h-full w-80 flex-col overflow-y-scroll border border-on-surface bg-surface-bright p-2 text-on-surface">
          Timeline
        </div>
      </div>
    </div>
  );
}

export default App;
