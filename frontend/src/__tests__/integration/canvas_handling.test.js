import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import * as faceapi from "face-api.js";

faceapi.nets.tinyFaceDetector = { loadFromUri: jest.fn() };
faceapi.nets.tinyFaceDetector.loadFromUri.mockResolvedValue();

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "mockURL");
});

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
  }));
});

test("clears canvas between media changes", async () => {
  const clearRectSpy = jest.fn();
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: clearRectSpy,
    drawImage: jest.fn(),
  }));

  render(<App />);

  await screen.findByText(/No media selected/i);

  const uploadButton = screen.getByText(/Upload Image\/Video/i);
  const fileInput = document.getElementById("mediaInput");

  const firstFile = new File(["firstFile"], "first.jpg", {
    type: "image/jpeg",
  });
  userEvent.click(uploadButton);

  await act(async () => {
    Object.defineProperty(fileInput, "files", {
      value: [firstFile],
      writable: true,
      configurable: true,
    });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  });

  const secondFile = new File(["secondFile"], "second.jpg", {
    type: "image/jpeg",
  });
  userEvent.click(uploadButton);

  await act(async () => {
    Object.defineProperty(fileInput, "files", {
      value: [secondFile],
      writable: true,
      configurable: true,
    });
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
  });

  expect(clearRectSpy).toHaveBeenCalled();
});
