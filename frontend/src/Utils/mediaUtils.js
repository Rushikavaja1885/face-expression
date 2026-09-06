
import { useState } from "react";

export default function MediaUtils() {
  const [media, setMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isWebcamOn, setIsWebcamOn] = useState(false);

  const [selectedModel, setSelectedModel] =
    useState("EfficientNetFER");

  const models = ["EfficientNetFER"];

  const handleMediaChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error("Please select an image file.");
      return;
    }

    setMedia(URL.createObjectURL(file));
    setMediaFile(file);
    setMediaType("image");
    setIsWebcamOn(false);
  };

  const startWebcam = () => {
    setMedia(null);
    setMediaFile(null);
    setMediaType(null);
    setIsWebcamOn(true);
  };

  const stopWebcam = () => {
    setIsWebcamOn(false);
  };

  return {
    media,
    mediaFile,
    mediaType,
    isWebcamOn,

    handleMediaChange,
    startWebcam,
    stopWebcam,

    selectedModel,
    setSelectedModel,
    models,
  };
}

