import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import * as faceapi from "face-api.js";

faceapi.nets.tinyFaceDetector = { loadFromUri: jest.fn() };

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
  }));
});

test("rejects unsupported file types and logs error message", async () => {
  const consoleErrorSpy = jest.spyOn(console, "error");

  render(<App />);

  await screen.findByText(/No media selected/i);

  const uploadButton = await screen.findByText(/Upload Image\/Video/i);
  const fileInput = document.getElementById("mediaInput");

  const file = new File(["dummy"], "unsupported.txt", { type: "text/plain" });

  userEvent.click(uploadButton);

  await act(async () => {
    Object.defineProperty(fileInput, "files", {
      value: [file],
    });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const errorLogFound = consoleErrorSpy.mock.calls.some(
    (call) => call[0] === "Error set: Invalid file type"
  );

  expect(errorLogFound).toBe(true);

  consoleErrorSpy.mockRestore();
});
