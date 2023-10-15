import { getDynamicName } from "../../../utils/helpers.utils";
import ProjectBrandingModal from "./ProjectBrandingModal.react";
import { render, screen } from "@testing-library/react";
import { Provider } from 'react-redux';
import { store } from "../../../app/store";

test("Check for form fields for branding", () => {
  const { getByText } = render(
    <Provider store={store}>
      <ProjectBrandingModal
        showModal={true}
        handleModalClose={() => { }}
        handleAllModalsClose={() => { }}
        selectedAccelerator={{ name: 'test' }}
      />
    </Provider>
  );
  expect(screen.getByTestId("form-heading")).toHaveTextContent("Experience");
  expect(getByText(/Primary color/i)).toBeInTheDocument();
  expect(getByText(/Brand Logo/i)).toBeInTheDocument();
  expect(getByText(/Default channel/i)).toBeInTheDocument();
});

test("Generate dynamic name when workflow name already exists ", () => {
  const dynamicName = getDynamicName(['workflow_1', 'workflow_10', 'ABCD', 'XYZ', 'workflow_name_01'], 'workflow');
  expect(dynamicName).toBe('workflow_11');
});

test("Generate dynamic name when project name already exists ", () => {
  const dynamicName = getDynamicName(['project_190', 'project_10', 'ABCD', 'XYZ', 'project_name'], 'project');
  expect(dynamicName).toBe('project_191');
});

