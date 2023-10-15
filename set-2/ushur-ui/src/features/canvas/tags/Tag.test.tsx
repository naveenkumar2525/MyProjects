import { render, screen } from "../../../utils/test.utils";
import Tag from "./Tag";

test("Tag renders", () => {
  render(<Tag text="tag" />);
  const tag = screen.getByText("tag");

  expect(tag).toBeInTheDocument();
});

test("Tag renders with icon", () => {
  render(<Tag text="tag" />);
  const icon = screen.getByRole("img", {
    hidden: true,
  });

  expect(icon).toBeInTheDocument();
});
