import { render, screen } from "@testing-library/react";
import Display from "../../Components/Display";
import { MediaContext } from "../../Context/MediaContext";

jest.mock("../../utils/displayUtils", () => ({
  clearCanvas: jest.fn(),
  runDetection: jest.fn(),
}));

beforeEach(() => {
  const mockContext = { clearRect: jest.fn() };
  HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
});

test('Shows "No media selected" when no media and webcam is off', () => {
  const mockContextValue = {
    media: null,
    mediaType: null,
    isWebcamOn: false,
    selectedModel: "fer2013_pytorch",
  };
  render(
    <MediaContext.Provider value={mockContextValue}>
      <Display />
    </MediaContext.Provider>
  );
  expect(screen.getByText(/No media selected/i)).toBeInTheDocument();
});

test('Displays image when mediaType is "image"', () => {
  const mockContextValue = {
    media: "test-image.jpg",
    mediaType: "image",
    isWebcamOn: false,
    selectedModel: "fer2013_pytorch",
  };
  render(
    <MediaContext.Provider value={mockContextValue}>
      <Display />
    </MediaContext.Provider>
  );
  const imgElement = screen.getByAltText(/Image/i);
  expect(imgElement).toBeInTheDocument();
  expect(imgElement).toHaveAttribute("src", "test-image.jpg");
});
