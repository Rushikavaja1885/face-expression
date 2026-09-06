import { cropFaces } from "../../Utils/faceProcessingUtils";
import { drawBoundingBoxes } from "../../Utils/faceDetectionUtils";

jest.mock("../../utils/faceDetectionUtils", () => ({
  drawBoundingBoxes: jest.fn(),
  detectFaces: jest.fn(),
  loadModels: jest.fn(),
}));

beforeEach(() => {
  const mockContext = {
    drawImage: jest.fn(),
    getImageData: jest.fn(() => ({ data: [] })),
    clearRect: jest.fn(),
  };
  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

  HTMLCanvasElement.prototype.toDataURL = jest.fn(
    () => "data:image/jpeg;base64,abc"
  );

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ emotion: "happy" }),
  });
});

test("cropFaces processes faces and draws bounding boxes", async () => {
  const detections = [{ box: { x: 0, y: 0, width: 50, height: 50 } }];
  const mediaElement = document.createElement("img");
  const dimensions = { width: 100, height: 100 };
  const canvas = document.createElement("canvas");
  const currentMediaId = 1;
  const mediaIdRef = { curren: 1 };

  await cropFaces(
    detections,
    mediaElement,
    "fer2013_pytorch",
    canvas,
    dimensions,
    mediaIdRef,
    currentMediaId
  );

  expect(drawBoundingBoxes).toHaveBeenCalled();
});
