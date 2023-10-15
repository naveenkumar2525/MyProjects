import { render, screen, waitFor, within } from "../../utils/test.utils";
import InfoCard, { CardProps } from "./InfoCard.react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ReactText } from "react";

const mockHistoryReplace = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

test("shows a published workflow card", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);

  const { dataSection, numberedCirclesSection } =
    validateCommonInfoCardContent();
  validateInfoCardPublished();
  validateDataSection(dataSection, infoCardProps);
  validateInfoCardNumberedCircles(numberedCirclesSection);
});

test("shows an unpublished workflow card", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: false,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);

  const { dataSection, numberedCirclesSection } =
    validateCommonInfoCardContent();
  validateInfoCardUnPublished();
  validateDataSection(dataSection, infoCardProps);
  validateInfoCardNumberedCircles(numberedCirclesSection);
});

test("shows an workflow card with disabled data", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: true,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);

  const { dataSection, numberedCirclesSection } =
    validateCommonInfoCardContent();
  validateInfoCardPublished();
  validateNoDataSection(dataSection, infoCardProps);
  validateInfoCardNumberedCircles(numberedCirclesSection);
});

test("shows an workflow card with disabled circled numbers", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: true,
  });

  render(<InfoCard {...infoCardProps} />);

  let element = screen.getByText(/my icon/i);
  expect(element).toBeInTheDocument();
  element = screen.getByRole('card-title');
  expect(element).toBeInTheDocument();
  const sections = screen.getAllByRole("section");
  expect(sections.length).toBe(1);
  const dataSection = sections[0];
  validateInfoCardPublished();
  validateDataSection(dataSection, infoCardProps);
});

test("can invoke workflow card `Open` button", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: true,
  });

  render(<InfoCard {...infoCardProps} />);

  const openButtonElement = screen.getByRole("button", { name: "Open" });
  expect(openButtonElement).toBeInTheDocument();
  await userEvent.click(openButtonElement);

  expect(mockHistoryReplace).toHaveBeenCalledWith({
    search: infoCardProps.route,
  });
});

test("can invoke the workflow card workflow menu button", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: true,
  });

  renderComponentWithRouter(infoCardProps);

  const workflowMenu = screen.getByTestId("workflow-menu");
  expect(workflowMenu).toBeInTheDocument();
  await userEvent.click(workflowMenu);

  const element = screen.getByText(/workflow menu/i);
  expect(element).toBeInTheDocument();
});

test("shows a faq card", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "faq-card",
    status: true,
    disablePill: false,
    disableCircles: true,
  });

  render(<InfoCard {...infoCardProps} />);

  let element = screen.getByText(/my icon/i);
  expect(element).toBeInTheDocument();
  element = screen.getByRole('card-title');
  expect(element).toBeInTheDocument();
  const sections = screen.getAllByRole("section");
  expect(sections.length).toBe(1);
  const dataSection = sections[0];
  validateInfoCardPublished();
  validateDataSection(dataSection, infoCardProps);
});

test("shows a datatable card", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "unknown", // card type can be anything
    status: true,
    disablePill: false,
    disableCircles: true,
  });

  render(<InfoCard {...infoCardProps} />);

  let element = screen.getByText(/my icon/i);
  expect(element).toBeInTheDocument();
  element = screen.getByRole('card-title');
  expect(element).toBeInTheDocument();
  const sections = screen.getAllByRole("section");
  expect(sections.length).toBe(1);
  const dataSection = sections[0];
  validateDataSection(dataSection, infoCardProps);
  element = screen.getByText(
    /Use this Datatable to store, manage, and export data./i
  );
  expect(element).toBeInTheDocument();
});

test("can invoke non-workflow card `Open` button", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "faq-card",
    status: true,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);

  const openButtonElement = screen.getByRole("button", { name: "Open" });
  expect(openButtonElement).toBeInTheDocument();
  await userEvent.click(openButtonElement);
  expect(mockHistoryReplace).toHaveBeenCalledWith({
    search: infoCardProps.route,
  });
});

test("contains a title tooltip", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);
  const tooltip = screen.getByRole('card-title-tooltip', { hidden: true });
  expect(tooltip).toBeInTheDocument();
});

test("shows check circle icon on published card", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);
  const checkIcon = screen.getByTitle("status-circle");
  expect(checkIcon).toBeInTheDocument();
});

test("show tooltip when hover on card title", async () => {
  const infoCardProps = setupInfoCardProps({
    cardType: "workflow-card",
    status: true,
    disablePill: false,
    disableCircles: false,
  });

  render(<InfoCard {...infoCardProps} />);
  const cardTitle = screen.getByRole('card-title');
  await userEvent.hover(cardTitle);
  waitFor(() => {
    expect(screen.getByRole('card-title-tooltip')).toBeInTheDocument();
  });
});

const renderComponentWithRouter = (infoCardProps: CardProps) => {
  return render(
    <MemoryRouter>
      <InfoCard {...infoCardProps} />
    </MemoryRouter>
  );
};

const setupInfoCardProps = ({
  cardType,
  status,
  disablePill,
  disableCircles,
}: {
  cardType: string;
  status: boolean;
  disablePill: boolean;
  disableCircles: boolean;
}) => {
  const infoCardProps: CardProps = {
    cardType,
    data: [
      {
        icon: "one",
        disablePill,
        value: "one_value",
        tooltipText: "some text",
        selevariable: "",
      },
      {
        icon: "two",
        disablePill,
        value: "two_value",
        tooltipText: "some text",
        selevariable: "",
      },
      {
        icon: "three",
        disablePill,
        value: "three_value",
        tooltipText: "some text",
        selevariable: "",
      },
      {
        icon: "four",
        disablePill,
        value: "four_value",
        tooltipText: "some text",
        selevariable: "",
      },
    ],
    header: { title: "My Card", icon: "my icon" },
    status,
    route: "https://dashboard",
    disableCircles,
    cardIndex: 1,
    selevariable: "",
  };

  return infoCardProps;
};

const validateCommonInfoCardContent = () => {
  let element = screen.getByText(/my icon/i);
  expect(element).toBeInTheDocument();
  element = screen.getByRole('card-title');
  expect(element).toBeInTheDocument();
  const sections = screen.getAllByRole("section");
  expect(sections.length).toBe(2);

  return {
    dataSection: sections[0],
    numberedCirclesSection: sections[1],
  };
};

const validateInfoCardPublished = () => {
  const element = screen.getByText(/^published/i);
  expect(element).toBeInTheDocument();
};

const validateInfoCardUnPublished = () => {
  const element = screen.getByText(/^unpublished/i);
  expect(element).toBeInTheDocument();
};

const validateDataSection = (
  dataSection: HTMLElement,
  infoCardProps: CardProps
) => {
  for (const item of infoCardProps.data) {
    const iconText = item.icon as ReactText;
    const valueText = item.value;
    let element = within(dataSection).getByText(iconText);
    expect(element).toBeInTheDocument();
    element = within(dataSection).getByText(valueText);
    expect(element).toBeInTheDocument();
  }
};

const validateNoDataSection = (
  dataSection: HTMLElement,
  infoCardProps: CardProps
) => {
  for (const item of infoCardProps.data) {
    const iconText = item.icon as ReactText;
    const valueText = item.value;
    let element = within(dataSection).queryByText(iconText);
    expect(element).not.toBeInTheDocument();
    element = within(dataSection).queryByText(valueText);
    expect(element).not.toBeInTheDocument();
  }
};

const validateInfoCardNumberedCircles = (
  numberedCirclesSection: HTMLElement
) => {
  let element = within(numberedCirclesSection).getByText(/1/);
  expect(element).toBeInTheDocument();
  element = within(numberedCirclesSection).getByText(/2/);
  expect(element).toBeInTheDocument();
  element = within(numberedCirclesSection).getByText(/3/);
  expect(element).toBeInTheDocument();
  element = within(numberedCirclesSection).getByText(/4/);
  expect(element).toBeInTheDocument();
  element = within(numberedCirclesSection).getByText(/5/);
  expect(element).toBeInTheDocument();
  element = within(numberedCirclesSection).getByText(/6/);
  expect(element).toBeInTheDocument();
};
