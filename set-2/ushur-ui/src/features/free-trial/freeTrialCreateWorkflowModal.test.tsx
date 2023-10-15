import { useEffect } from "react";
import { render } from "../../utils/test.utils";
import FreeTrialCreateWorkflowModal from "./FreeTrialCreateWorkflowModal.react";
import { setAccelerators } from "./freeTrialSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const handleModalClose = () => jest.fn();

const Component = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      setAccelerators([
        {
          name: "First Notice of Loss",
          description: "unit testing testing data one",
          ufoPath: "",
          iconUrl: "first-notice-of-loss.png",
          primaryColor: "#D1F3FF",
          projectName: "project11",
        },
        {
          name: "Return to Work",
          description: "unit testing testing data two",
          ufoPath: "",
          iconUrl: "person-to-door.png",
          primaryColor: "#FFF7A1",
          projectName: "project12",
        },
      ])
    );
  }, []);
  return (
    <FreeTrialCreateWorkflowModal
      handleModalClose={handleModalClose}
      showModal={true}
    />
  );
};

test("should display accelerator title and description", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/First Notice of Loss/i)).toBeInTheDocument();
  expect(getByText(/unit testing testing data one/i)).toBeInTheDocument();
  expect(getByText(/Return to Work/i)).toBeInTheDocument();
  expect(getByText(/unit testing testing data two/i)).toBeInTheDocument();
});

test("should display the modal heading and subheading", () => {
  const { getByText, container } = render(<Component />);
  expect(getByText("Create Project")).toBeInTheDocument();
  expect(
    getByText(
      "Projects are collections of workflows, datatables, and brand settings."
    )
  ).toBeInTheDocument();
});
