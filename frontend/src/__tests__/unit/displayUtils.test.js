import { runDetection } from "../../Utils/displayUtils";
import { createCanvas } from "../../Utils/canvasUtils";

jest.mock("../../Utils/canvasUtils", () => ({
  createCanvas: jest.fn(),
}));

jest.mock("../../Utils/faceDetectionUtils", () => ({
  detectFaces: jest.fn(),
}));

jest.mock("../../Utils/faceProcessingUtils", () => ({
  cropFaces: jest.fn(),
}));

global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    clearRect: jest.fn(),
  }));

  createCanvas.mockReturnValue({
    canvas: document.createElement("canvas"),
    mediaSize: { width: 100, height: 100 },
  });
});

test("runDetection handles image media type", () => {
  const mediaType = "image";
  const mediaElement = document.createElement("img");
  const mediaIdRef = { current: 1 };
  const currentMediaId = 1;
  const canvasRef = { current: document.createElement("canvas") };
  const animationFrameRef = { current: null };
  const selectedModel = "mockModel";

  const cleanup = runDetection(
    mediaType,
    mediaElement,
    mediaIdRef,
    currentMediaId,
    canvasRef,
    animationFrameRef,
    selectedModel
  );

  expect(mediaElement.onload).toBeDefined();
  expect(createCanvas).toHaveBeenCalled();
  cleanup();
  expect(mediaElement.onload).toBeNull();
});

test("runDetection handles video media type", () => {
  const mediaType = "video";
  const mediaElement = document.createElement("video");

  Object.defineProperty(mediaElement, "readyState", {
    value: 3,
    writable: false,
  });
  Object.defineProperty(mediaElement, "paused", {
    value: false,
    writable: false,
  });
  Object.defineProperty(mediaElement, "ended", {
    value: false,
    writable: false,
  });

  const mediaIdRef = { current: 1 };
  const currentMediaId = 1;
  const canvasRef = { current: document.createElement("canvas") };
  const animationFrameRef = { current: null };
  const selectedModel = "mockModel";

  global.requestAnimationFrame.mockImplementationOnce((cb) => {
    animationFrameRef.current = setTimeout(cb, 0);
    return animationFrameRef.current;
  });

  const cleanup = runDetection(
    mediaType,
    mediaElement,
    mediaIdRef,
    currentMediaId,
    canvasRef,
    animationFrameRef,
    selectedModel
  );

  expect(mediaElement.onloadeddata).toBeDefined();
  expect(global.requestAnimationFrame).toHaveBeenCalled();

  cleanup();
  expect(mediaElement.onloadeddata).toBeNull();
  expect(global.cancelAnimationFrame).toHaveBeenCalledWith(
    animationFrameRef.current
  );
});
