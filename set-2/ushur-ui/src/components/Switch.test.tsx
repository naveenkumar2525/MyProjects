import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Switch from "./CustomSwitch.react";

test("renders switch component with active state", () => {
  const { getByText } = render(
    <Switch
      toggle
      activeColor="blue"
      inactiveColor="grey"
      activeText="Active"
      inactiveText="Inactive"
      style={{ whiteSpace: "nowrap" }}
      onChange={() => {}}
    />
  );

  expect(getByText("Active")).toBeInTheDocument();
});

test("renders switch component with inactive state", () => {
  const { getByText } = render(
    <Switch
      toggle={false}
      activeColor="blue"
      inactiveColor="grey"
      activeText="Active"
      inactiveText="Inactive"
      style={{ whiteSpace: "nowrap" }}
      onChange={() => {}}
    />
  );

  expect(getByText("Inactive")).toBeInTheDocument();
});

test("switch component onclick", async () => {
  const onclick = jest.fn();
  const { container, getByText } = render(
    <Switch
      toggle={false}
      activeColor="blue"
      inactiveColor="grey"
      activeText="Active"
      inactiveText="Inactive"
      style={{ whiteSpace: "nowrap" }}
      onChange={onclick}
      />
  );
  const sw: any = container.querySelector(".switch_container");
  fireEvent.click(sw);

  expect(onclick).toHaveBeenCalledTimes(1);
});
