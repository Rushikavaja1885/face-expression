import {
  loadModels,
  detectFaces,
  drawBoundingBoxes,
} from "../../Utils/faceDetectionUtils";
import * as faceapi from "face-api.js";

jest.mock("../../Utils/canvasUtils", () => ({
  clearCanvas: jest.fn(),
}));

faceapi.nets.tinyFaceDetector = { loadFromUri: jest.fn() };
faceapi.detectAllFaces = jest.fn();
faceapi.resizeResults = jest.fn();

test("loadModels calls faceapi loadFromUri", async () => {
  await loadModels();
  expect(faceapi.nets.tinyFaceDetector.loadFromUri).toHaveBeenCalledWith(
    "./models"
  );
});

test("detectFaces calls detectAllFaces and returns detections", async () => {
  const mockDetections = [{ box: {} }];
  faceapi.detectAllFaces.mockResolvedValue(mockDetections);

  const img = document.createElement("img");
  const detections = await detectFaces(img);
  expect(detections).toEqual(mockDetections);
});

test("drawBoundingBoxes draws boxes and text", async () => {
  const clearCanvas = require("../../Utils/canvasUtils").clearCanvas;
  const canvas = document.createElement("canvas");
  const detections = [{ box: { x: 10, y: 10, width: 100, height: 100 } }];
  const mediaSize = { width: 200, height: 200 };

  const mockDraw = jest.fn();
  faceapi.draw.DrawBox = jest.fn().mockImplementation(() => ({
    draw: mockDraw,
  }));

  faceapi.resizeResults.mockReturnValue(detections);

  await drawBoundingBoxes(canvas, detections, mediaSize, { current: 0 }, 0, [
    "happy",
  ]);

  expect(clearCanvas).toHaveBeenCalledWith(canvas);
  expect(faceapi.resizeResults).toHaveBeenCalledWith(detections, mediaSize);
  expect(faceapi.draw.DrawBox).toHaveBeenCalledTimes(1);
  expect(faceapi.draw.DrawBox).toHaveBeenCalledWith(
    detections[0].box,
    expect.objectContaining({ label: "happy", lineWidth: 2 })
  );
  expect(mockDraw).toHaveBeenCalledWith(canvas);
});
