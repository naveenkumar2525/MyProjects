import UserEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "../../../utils/test.utils";

import {
  diagrammingCellFactory,
  stateFactory,
} from "../../../mocks/factories/test/state";

import InspectorTitle from "./InspectorTitle";

const diagramCell = diagrammingCellFactory.build()();

const setup = () => {
  const utils = render(<InspectorTitle cell={diagramCell} />);
  fireEvent.click(screen.getByRole("button", { name: "label-button" }));
  const input = utils.getByRole("textbox");
  return {
    input,
    ...utils,
  };
};

test("should not show the title inspector when no step is selected", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: undefined,
    },
  });

  render(<InspectorTitle cell={diagramCell} />, {
    preloadedState,
  });

  const element = screen.queryByText("Some title");
  expect(element).not.toBeInTheDocument();
});

test("should show label text in inspector", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  render(<InspectorTitle cell={diagramCell} />, {
    preloadedState,
  });

  const element = screen.getByRole("button", { name: "label-button" });
  expect(element).toBeInTheDocument();
});
test("should show description text in inspector", () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  render(<InspectorTitle cell={diagramCell} />, {
    preloadedState,
  });
  const element = screen.getByRole("button", { name: "description-button" });
  expect(element).toBeInTheDocument();
});

test("should show pencil icon when label is hovered", async () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  render(<InspectorTitle cell={diagramCell} />, {
    preloadedState,
  });

  const element = screen.getByRole("button", { name: "label-button" });
  await UserEvent.hover(element);

  const Pencil = screen.getByTitle("Pencil-description");
  expect(Pencil).toBeInTheDocument();
});

test("should show pencil icon when description is hovered", async () => {
  const preloadedState = stateFactory.build({
    canvas: {
      selectedCellId: "test cell",
    },
  });

  const { getByRole, getByTitle } = render(
    <InspectorTitle cell={diagramCell} />,
    {
      preloadedState,
    }
  );

  const element = getByRole("button", { name: "description-button" });
  await UserEvent.hover(element);

  const Pencil = getByTitle("Pencil-description");
  expect(Pencil).toBeInTheDocument();
});

test("should show input when description is clicked", () => {
  const { getByRole } = render(<InspectorTitle cell={diagramCell} />);

  fireEvent.click(getByRole("button", { name: "description-button" }));
  const form = screen.getByRole("textbox");

  expect(form).toBeInTheDocument();
});

it("should show input when label is clicked", () => {
  const { getByRole } = render(<InspectorTitle cell={diagramCell} />);
  fireEvent.click(getByRole("button", { name: "label-button" }));
  const form = screen.getByRole("textbox");

  expect(form).toBeInTheDocument();
});

test("should change label input value", () => {
  const { input } = setup();

  fireEvent.change(input, { target: { value: "Label testing" } });
  fireEvent.click(screen.getByRole("textbox"));
  expect((input as HTMLInputElement).value).toBe("Label testing");
});

test("should change description input value", () => {
  const { input } = setup();

  fireEvent.change(input, { target: { value: "Description testing" } });
  fireEvent.click(screen.getByRole("textbox"));
  expect((input as HTMLInputElement).value).toBe("Description testing");
});
