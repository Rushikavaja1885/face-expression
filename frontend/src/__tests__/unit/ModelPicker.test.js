import { render, screen, fireEvent } from "@testing-library/react";
import ModelPicker from "../../Components/ModelPicker";
import { MediaContext } from "../../Context/MediaContext";

test("ModelPicker displays models and handles selection change", () => {
  const mockContextValue = {
    models: [
      "fer2013_pytorch",
      "fer2013_tf",
      "kdef_pytorch",
      "kdef_tf",
      "mixed_pytorch",
      "mixed_tf",
      "nhfi_pytorch",
      "nhfi_tf",
    ],
    selectedModel: "fer2013_pytorch",
    setSelectedModel: jest.fn(),
  };

  render(
    <MediaContext.Provider value={mockContextValue}>
      <ModelPicker />
    </MediaContext.Provider>
  );

  const selectElement = screen.getByLabelText(/Select model:/i);
  fireEvent.change(selectElement, { target: { value: "kdef_tf" } });
  expect(mockContextValue.setSelectedModel).toHaveBeenCalledWith("kdef_tf");
});
