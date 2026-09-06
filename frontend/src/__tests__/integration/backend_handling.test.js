import { cropFaces } from "../../Utils/faceProcessingUtils";
import { drawBoundingBoxes } from "../../Utils/faceDetectionUtils";

jest.mock("../../Utils/faceDetectionUtils", () => ({
  drawBoundingBoxes: jest.fn(),
}));

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    drawImage: jest.fn(),
  }));
  HTMLCanvasElement.prototype.toDataURL = jest.fn(
    () => "data:image/jpeg;base64,mockBase64"
  );
});

test("handles backend error and returns null emotion during face cropping", async () => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    })
  );

  const detections = [{ box: { x: 10, y: 20, width: 100, height: 100 } }];
  const mediaElement = document.createElement("img");
  const canvas = document.createElement("canvas");
  const mediaSize = { width: 200, height: 200 };
  const mediaIdRef = { current: 1 };
  const currentMediaId = 1;
  const selectedModel = "mockModel";

  await cropFaces(
    detections,
    mediaElement,
    selectedModel,
    canvas,
    mediaSize,
    mediaIdRef,
    currentMediaId
  );

  expect(global.fetch).toHaveBeenCalledWith(
    "http://127.0.0.1:8000/api/predict_emotion",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
  );

  expect(drawBoundingBoxes).toHaveBeenCalledWith(
    canvas,
    detections,
    mediaSize,
    mediaIdRef,
    currentMediaId,
    [null]
  );
});

test("handles successful backend response during face cropping", async () => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({ emotion: "happy" }),
    })
  );

  const detections = [
    { box: { x: 10, y: 20, width: 100, height: 100 } },
    { box: { x: 50, y: 50, width: 100, height: 100 } },
  ];
  const mediaElement = document.createElement("img");
  const canvas = document.createElement("canvas");
  const mediaSize = { width: 200, height: 200 };
  const mediaIdRef = { current: 1 };
  const currentMediaId = 1;
  const selectedModel = "mockModel";

  await cropFaces(
    detections,
    mediaElement,
    selectedModel,
    canvas,
    mediaSize,
    mediaIdRef,
    currentMediaId
  );

  expect(global.fetch).toHaveBeenCalledTimes(detections.length);

  expect(drawBoundingBoxes).toHaveBeenCalledWith(
    canvas,
    detections,
    mediaSize,
    mediaIdRef,
    currentMediaId,
    ["happy", "happy"]
  );
});
