
import React, { useContext } from "react";
import "./Buttons.css";
import { MediaContext } from "../Context/MediaContext";

export default function Buttons() {
  const {
    handleMediaChange,
    isWebcamOn,
    startWebcam,
    stopWebcam,
  } = useContext(MediaContext);

  return (
    <div className="button-container">
      {isWebcamOn ? (
        <button className="button-style" onClick={stopWebcam}>
          Stop Webcam
        </button>
      ) : (
        <>
          <input
            type="file"
            id="mediaInput"
            accept="image/*"
            onChange={handleMediaChange}
            style={{ display: "none" }}
          />

          <button
            className="button-style"
            onClick={() => {
              document.getElementById("mediaInput").click();
            }}
          >
            Upload Image
          </button>

          <button
            className="button-style"
            onClick={startWebcam}
          >
            Start Webcam
          </button>
        </>
      )}
    </div>
  );
}

