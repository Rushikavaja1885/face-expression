
import "./Display.css";
import Webcam from "react-webcam";
import { useContext, useEffect, useRef, useState } from "react";

import { MediaContext } from "../Context/MediaContext";
import {
  predictImage,
  createWebSocket,
  sendFrame,
} from "../Utils/backendUtils";

export default function Display() {
  const { media, mediaFile, mediaType, isWebcamOn } =
    useContext(MediaContext);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  // Prevent frames from piling up
  const processingRef = useRef(false);
  const timerRef = useRef(null);

  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);

  // =========================
  // IMAGE DETECTION
  // =========================
  useEffect(() => {
    if (!mediaFile || mediaType !== "image") {
      return;
    }

    let imageUrl = null;

    const processImage = async () => {
      try {
        setError(null);

        const result = await predictImage(mediaFile);

        imageUrl = result;
        setProcessedImage(result);
      } catch (err) {
        console.error("Image detection error:", err);
        setError("Failed to process image.");
      }
    };

    processImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [mediaFile, mediaType]);

  // =========================
  // LIVE WEBCAM DETECTION
  // =========================
  useEffect(() => {
    if (!isWebcamOn) {
      return;
    }

    setError(null);

    const socket = createWebSocket();
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to emotion detection backend.");

      socket.send(
        JSON.stringify({
          type: "config",
          emoji: false,
        })
      );

      startDetection();
    };

    socket.onmessage = (event) => {
      // Backend has finished processing the current frame
      processingRef.current = false;

      if (typeof event.data === "string") {
        return;
      }

      const blob = event.data;
      const image = new Image();

      image.onload = () => {
        const canvas = canvasRef.current;

        if (!canvas) {
          URL.revokeObjectURL(image.src);
          return;
        }

        const context = canvas.getContext("2d");

        canvas.width = image.width;
        canvas.height = image.height;

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        URL.revokeObjectURL(image.src);
      };

      image.src = URL.createObjectURL(blob);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      processingRef.current = false;
      setError("Could not connect to the backend.");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected.");
      processingRef.current = false;
    };

    // Only send a new frame when the previous one is finished
    function startDetection() {
      timerRef.current = setInterval(async () => {
        if (
          !webcamRef.current ||
          !socketRef.current ||
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          return;
        }

        // IMPORTANT:
        // Don't send another frame while backend
        // is still processing the previous frame.
        if (processingRef.current) {
          return;
        }

        const screenshot =
          webcamRef.current.getScreenshot();

        if (!screenshot) {
          return;
        }

        try {
          processingRef.current = true;

          await sendFrame(
            socketRef.current,
            screenshot
          );
        } catch (err) {
          console.error(
            "Error sending webcam frame:",
            err
          );

          processingRef.current = false;
        }
      }, 200);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      processingRef.current = false;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext("2d");

        context.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    };
  }, [isWebcamOn]);

  // =========================
  // DISPLAY
  // =========================
  return (
    <div className="display-container">
      {isWebcamOn ? (
        <>
          <Webcam
            className="webcam"
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 360,
              facingMode: "user",
            }}
            ref={webcamRef}
          />

          <canvas
            ref={canvasRef}
            className="canvasStyle"
          />
        </>
      ) : processedImage ? (
        <img
          src={processedImage}
          className="media"
          alt="Processed emotion detection"
        />
      ) : media ? (
        <img
          src={media}
          className="media"
          alt="Selected"
        />
      ) : error ? (
        <p className="text">{error}</p>
      ) : (
        <p className="text">
          Select an image or start the webcam
        </p>
      )}
    </div>
  );
}
