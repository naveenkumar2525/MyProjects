import Simulator from "./Simulator.react";
import { render, screen } from "../utils/test.utils";

test("Should render Simulator", () => {
  const HeaderElement = () => <div />;
  const BodyElement = () => <div />;
  render(<Simulator HeaderElement={HeaderElement} BodyElement={BodyElement} />);

  const section = screen.getByTestId("mobile_simulator_outer");
  expect(section).toBeInTheDocument();
});
