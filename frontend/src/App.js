import "./App.css";
import { useState } from "react";
import Display from "./Components/Display";
import Buttons from "./Components/Buttons";
import ModelPicker from "./Components/ModelPicker";
import { MediaProvider } from "./Context/MediaContext";

function App() {
  return (
    <MediaProvider>
      <div className="app-container">
        <Display />
        <ModelPicker />
        <Buttons />
      </div>
    </MediaProvider>
  );
}

export default App;