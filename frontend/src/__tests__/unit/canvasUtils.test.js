import {
  clearCanvas,
  clearCanvasRef,
  createCanvas,
} from "../../Utils/canvasUtils";

beforeEach(() => {
  const mockContext = { clearRect: jest.fn() };
  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
});

test("clearCanvas clears the canvas", () => {
  const canvas = document.createElement("canvas");
  clearCanvas(canvas);
  const ctx = canvas.getContext("2d");
  expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
});

test("clearCanvasRef clears the canvas", () => {
  const canvas = document.createElement("canvas");
  clearCanvasRef({ current: canvas });
  const ctx = canvas.getContext("2d");
  expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
});

test("createCanvas creates canvas properly and returns media size", () => {
  const mediaElement = document.createElement("img");
  mediaElement.getBoundingClientRect = jest.fn(() => ({
    width: 800,
    height: 450,
  }));
  const canvas = document.createElement("canvas");
  const canvasRef = { current: canvas };
  const result = createCanvas(mediaElement, canvasRef);
  expect(canvas.width).toBe(800);
  expect(canvas.height).toBe(450);
  expect(result.mediaSize).toEqual({ width: 800, height: 450 });
  expect(result.canvas).toBe(canvas);
});
