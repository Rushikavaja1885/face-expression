import { render, screen } from "@testing-library/react";
import App from "../../App";
import * as faceapi from "face-api.js";
faceapi.nets.tinyFaceDetector = { loadFromUri: jest.fn() };

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
  }));
});

test("renders App with sub-components after face-api loads", async () => {
  render(<App />);
  expect(await screen.findByText(/No media selected/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/Select model:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Upload Image\/Video/i)).toBeInTheDocument();
  expect(await screen.findByText(/Start Webcam/i)).toBeInTheDocument();
});
