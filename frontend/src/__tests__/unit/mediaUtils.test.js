import MediaUtils from "../../Utils/mediaUtils";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: jest.fn(),
  };
});

let setMedia, setMediaType, setIsWebcamOn, setErrorMessage;
let useStateMock;

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => "mockObjectURL");
  global.URL.revokeObjectURL = jest.fn();

  setMedia = jest.fn();
  setMediaType = jest.fn();
  setIsWebcamOn = jest.fn();
  setErrorMessage = jest.fn();

  useStateMock = jest
    .fn()
    .mockImplementationOnce(() => ["oldURL", setMedia])
    .mockImplementationOnce(() => [null, setMediaType])
    .mockImplementationOnce(() => [false, setIsWebcamOn])
    .mockImplementationOnce(() => ["fer2013_pytorch", jest.fn()])
    .mockImplementationOnce(() => ["", setErrorMessage]);

  require("react").useState.mockImplementation(useStateMock);
});

test("startWebcam clears media and turns on webcam", () => {
  const utils = MediaUtils();

  utils.startWebcam();

  expect(setMedia).toHaveBeenCalledWith(null);
  expect(setMediaType).toHaveBeenCalledWith(null);
  expect(setIsWebcamOn).toHaveBeenCalledWith(true);
});

test("stopWebcam sets isWebcamOn to false", () => {
  const utils = MediaUtils();

  utils.stopWebcam();

  expect(setIsWebcamOn).toHaveBeenCalledWith(false);
});

test("handleMediaChange with image sets media and type to image", () => {
  const utils = MediaUtils();
  const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
  const event = { target: { files: [file] } };

  utils.handleMediaChange(event);

  expect(setMedia).toHaveBeenCalledWith("mockObjectURL");
  expect(setMediaType).toHaveBeenCalledWith("image");
  expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
});

test("handleMediaChange with video sets media and type to video", () => {
  const utils = MediaUtils();
  const file = new File(["dummy"], "test.mp4", { type: "video/mp4" });
  const event = { target: { files: [file] } };

  utils.handleMediaChange(event);

  expect(setMedia).toHaveBeenCalledWith("mockObjectURL");
  expect(setMediaType).toHaveBeenCalledWith("video");
  expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
});
