import { render, screen } from "../../../../utils/test.utils";
import { stateFactory } from "../../../../mocks/factories/test/state";
import Timeline from "./Timeline";

test("Timeline renders", () => {
  render(<Timeline />);
  const list = screen.getByRole("list");

  expect(list).toBeInTheDocument();
});

test("Timeline after init ushur call", async () => {
  const preloadedState = stateFactory.build({
    canvas: {
      initUshurResponse: {
        accumulatedData: [
          {
            engagementStatus: "WAITING_FOR_INPUT",
            module: "freeresponse",
            uetag: "UeTag_993488",
            promptText: "Name",
          },
        ],
      },
    },
  });
  render(<Timeline />, {
    preloadedState,
  });
  const listItem = await screen.findAllByRole("listitem");

  expect(listItem).toHaveLength(1);
});

test("Timeline after continue ushur call", async () => {
  const preloadedState = stateFactory.build({
    canvas: {
      initUshurResponse: {
        accumulatedData: [
          {
            engagementStatus: "WAITING_FOR_INPUT",
            module: "freeresponse",
            uetag: "UeTag_993488",
            promptText: "Name",
          },
        ],
      },
      continueUshurResponse: {
        accumulatedData: [
          {
            engagementStatus: "WAITING_FOR_INPUT",
            module: "freeresponse",
            uetag: "UeTag_363756",
            promptText: "Email",
          },
        ],
      },
    },
  });
  render(<Timeline />, {
    preloadedState,
  });
  const listItem = await screen.findAllByRole("listitem");

  expect(listItem).toHaveLength(2);
});

test("Timeline after getting ue tag variables", async () => {
  const preloadedState = stateFactory.build({
    canvas: {
      initUshurResponse: {
        accumulatedData: [
          {
            engagementStatus: "WAITING_FOR_INPUT",
            module: "freeresponse",
            uetag: "UeTag_993488",
            promptText: "Name",
          },
        ],
      },
      continueUshurResponse: {
        accumulatedData: [
          {
            engagementStatus: "WAITING_FOR_INPUT",
            module: "freeresponse",
            uetag: "UeTag_363756",
            promptText: "Email",
          },
        ],
      },
      ueTagVariables: {
        result: [
          {
            lastEngagementTime: "2022-12-01T07:19:01.568Z",
            requestId: "requestId",
            variables: {
              Choice: "1",
            },
            ueTag: "UeTag_993488",
          },
          {
            lastEngagementTime: "2022-11-30T08:48:47.572Z",
            requestId: "requestId",
            variables: {
              Name: "Football",
            },
            ueTag: "UeTag_506786",
          },
        ],
      },
    },
  });
  render(<Timeline />, {
    preloadedState,
  });
  const listItem = await screen.findAllByRole("listitem");

  expect(listItem).toHaveLength(2);
});
