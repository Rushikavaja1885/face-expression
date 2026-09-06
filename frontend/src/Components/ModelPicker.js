import React, { useContext } from "react";
import "./ModelPicker.css";
import { MediaContext } from "../Context/MediaContext";

export default function ModelPicker() {
  const { selectedModel } = useContext(MediaContext);

  return (
    <div className="modelPickerContainer">
      <label htmlFor="model-select">Model: </label>
      <select id="model-select" value={selectedModel} disabled>
        <option value="EfficientNetFER">
          YOLOv11 + EfficientNet-B0
        </option>
      </select>
    </div>
  );
}