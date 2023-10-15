import { groupBy } from "lodash";
import UshursList from "./UshursList.react";
import { server } from "../../mocks/server";
import { render, screen, within } from "../../utils/test.utils";
import emptyResponseHandlers from "../../mocks/handlers/emptyHandlers";
import { getCampaignListDefaultResponse } from "../../mocks/repository/defaultWorkflow";

type CoreUsherLayout = {
  statsSection: HTMLElement;
  recentWorkflowsSection: HTMLElement;
  projectListSection: HTMLElement;
};

const validateCoreUshurListLayout = (): CoreUsherLayout => {
  let element = screen.getByRole("heading", { name: "Projects" });
  expect(element).toBeInTheDocument();

  const subtitleText =
    /Manage and create new projects and workflows to automate customer engagements./i;
  element = screen.getByText(subtitleText);
  expect(element).toBeInTheDocument();

  const [
    statsSection,
    recentWorkflowsSection,
    projectListMenuSection,
    projectListSection,
  ] = screen.getAllByRole("section");

  expect(statsSection).toBeInTheDocument();
  expect(recentWorkflowsSection).toBeInTheDocument();
  expect(projectListMenuSection).toBeInTheDocument();
  expect(projectListSection).toBeInTheDocument();

  element = within(recentWorkflowsSection).getByRole("heading", {
    name: /recently edited workflows/i,
  });
  expect(element).toBeInTheDocument();

  element = screen.getByRole("heading", {
    name: /all projects/i,
  });
  expect(element).toBeInTheDocument();

  element = within(projectListMenuSection).getByRole("button", {
    name: "Create Project",
  });
  expect(element).toBeInTheDocument();

  element = within(projectListMenuSection).getByRole("button", {
    name: "Create Workflow",
  });
  expect(element).toBeInTheDocument();

  element = within(projectListMenuSection).getByRole("button", {
    name: "Sort by Recent",
  });
  expect(element).toBeInTheDocument();

  return {
    statsSection,
    recentWorkflowsSection,
    projectListSection,
  };
};

test("layouts multiple workflows", async () => {
  render(<UshursList />);

  const { statsSection, recentWorkflowsSection, projectListSection } =
    validateCoreUshurListLayout();

  // Validate stats
  const projectStats = within(statsSection);
  let element = await projectStats.findByText("2");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("Projects");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("6");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("Total workflows");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("0");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("Active workflows");
  expect(element).toBeInTheDocument();

  // Validate cards in the Recent Workflows Section
  const recentWorkflowsCards = within(recentWorkflowsSection).getAllByRole(
    "button",
    {
      name: /open/i,
    }
  );
  const expectedNumberOfRecentWorkflowsCards = 3;
  expect(recentWorkflowsCards.length).toBe(
    expectedNumberOfRecentWorkflowsCards
  );

  // Validate the Project list section
  const projectListExpandButtons =
    within(projectListSection).getAllByText(/expand/i);

  const expectedWorkflows = getCampaignListDefaultResponse.campaignList;
  const expectedGroupedProjects = groupBy(expectedWorkflows, "AppContext");
  const expectedNumberOfProjects = Object.keys(expectedGroupedProjects).length;
  expect(projectListExpandButtons.length).toBe(expectedNumberOfProjects);

  const projectsElements = within(projectListSection).getAllByRole("list");
  expect(projectsElements.length).toBe(expectedNumberOfProjects);

  // Ensure that each project has the correct set of cards
  const seenExpectedAppContext: Record<string, boolean> = {};
  let projectIndex = 0;
  for (const expectedWorkflow of expectedWorkflows) {
    if (seenExpectedAppContext[expectedWorkflow.AppContext]) {
      continue;
    }
    seenExpectedAppContext[expectedWorkflow.AppContext] = true;
    const expectedOpenButtons =
      expectedGroupedProjects[expectedWorkflow.AppContext].length;
    const projectOpenButtons = within(
      projectsElements[projectIndex]
    ).getAllByRole("button", {
      name: /open/i,
    });
    expect(projectOpenButtons.length).toBe(expectedOpenButtons + 1); // +1 for Datastore card

    projectIndex += 1;
  }
});

test("layout for empty workflows is correct", async () => {
  emptyResponseHandlers.forEach((handler) => {
    server.use(handler);
  });
  render(<UshursList />);
  const { statsSection, recentWorkflowsSection, projectListSection } =
    validateCoreUshurListLayout();

  // Validate stats
  const projectStats = within(statsSection);
  const allZeros = await projectStats.findAllByText("0");
  expect(allZeros.length).toBe(3);
  let element = await projectStats.findByText("Projects");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("Total workflows");
  expect(element).toBeInTheDocument();
  element = await projectStats.findByText("Active workflows");
  expect(element).toBeInTheDocument();

  // Validate that no recent workflows exist
  const cards = within(recentWorkflowsSection).queryAllByRole("button", {
    name: /open/i,
  });
  expect(cards.length).toBe(0);

  // Validate that no projects exist
  const exp = within(projectListSection).queryAllByText(/expand/i);
  expect(exp.length).toBe(0);
});
