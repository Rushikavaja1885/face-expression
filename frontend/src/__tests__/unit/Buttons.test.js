import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Buttons from "../../Components/Buttons";
import { MediaContext } from "../../Context/MediaContext";

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => "mockObjectURL");
  global.URL.revokeObjectURL = jest.fn();
});

test("Buttons show upload and start webcam when webcam is off", () => {
  const mockContextValue = {
    handleMediaChange: jest.fn(),
    isWebcamOn: false,
    startWebcam: jest.fn(),
    stopWebcam: jest.fn(),
  };

  render(
    <MediaContext.Provider value={mockContextValue}>
      <Buttons />
    </MediaContext.Provider>
  );

  expect(screen.getByText("Upload Image/Video")).toBeInTheDocument();
  expect(screen.getByText("Start Webcam")).toBeInTheDocument();
  expect(screen.queryByText("Stop Webcam")).not.toBeInTheDocument();
});

test("Buttons show stop webcam when webcam is on", () => {
  const mockContextValue = {
    handleMediaChange: jest.fn(),
    isWebcamOn: true,
    startWebcam: jest.fn(),
    stopWebcam: jest.fn(),
  };

  render(
    <MediaContext.Provider value={mockContextValue}>
      <Buttons />
    </MediaContext.Provider>
  );

  expect(screen.getByText("Stop Webcam")).toBeInTheDocument();
  expect(screen.queryByText("Upload Image/Video")).not.toBeInTheDocument();
  expect(screen.queryByText("Start Webcam")).not.toBeInTheDocument();
});

test("Clicking 'Start Webcam' updates states correctly", async () => {
  const mockContextValue = {
    handleMediaChange: jest.fn(),
    isWebcamOn: false,
    startWebcam: jest.fn(() => {
      global.URL.revokeObjectURL("oldURL");
      mockContextValue.mediaURLRef.current = null;
      mockContextValue.isWebcamOn = true;
      mockContextValue.setMedia(null);
      mockContextValue.setMediaType(null);
    }),
    stopWebcam: jest.fn(),
    mediaURLRef: { current: "oldURL" },

    setMedia: jest.fn(),
    setMediaType: jest.fn(),
  };

  render(
    <MediaContext.Provider value={mockContextValue}>
      <Buttons />
    </MediaContext.Provider>
  );

  await userEvent.click(screen.getByText("Start Webcam"));

  expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("oldURL");
  expect(mockContextValue.mediaURLRef.current).toBe(null);

  expect(mockContextValue.startWebcam).toHaveBeenCalled();

  expect(mockContextValue.setMedia).toHaveBeenCalledWith(null);
  expect(mockContextValue.setMediaType).toHaveBeenCalledWith(null);

  expect(mockContextValue.isWebcamOn).toBe(true);
});
