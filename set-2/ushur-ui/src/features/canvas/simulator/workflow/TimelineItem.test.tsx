import { render, screen } from "../../../../utils/test.utils";
import TimeLineItem from "./TimelineItem";
import ModuleIcons from "../../interfaces/module-icons";

test("Timeline item renders", () => {
  render(
    <TimeLineItem
      title="Timeline Item"
      Icon={ModuleIcons["form-module"]}
      promptText="promptText"
      uetag="UeTag_363756"
      variables={[
        {
          name: "Name",
          value: "Name",
        },
      ]}
    />
  );
  const title = screen.getByText("Timeline Item");

  expect(title).toBeInTheDocument();
});
