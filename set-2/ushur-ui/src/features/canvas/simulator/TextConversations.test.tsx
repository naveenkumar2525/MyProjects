import TextConversations from "./TextConversations.react";
import { render, screen } from "../../../utils/test.utils";

test("Should render Simulator", async () => {
  render(<TextConversations />);

  const element = await screen.findByText("Building your workflow...");
  expect(element).toBeInTheDocument();

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const promiseElement = await screen.findByText(/Choose your favorite city/);
  expect(promiseElement).toBeInTheDocument();
});
