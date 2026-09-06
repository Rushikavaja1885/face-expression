// FailModelLoading.test.js

import { render, screen, waitFor } from "@testing-library/react";
import App from "../../App";
import * as faceapi from "face-api.js";

describe("Model loading failures", () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    }));
  });

  test("logs console error when model loading fails", async () => {
    faceapi.nets.tinyFaceDetector.loadFromUri = jest
      .fn()
      .mockRejectedValue(new Error("Model load failure"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to load models");
    });

    consoleErrorSpy.mockRestore();
  });
});
