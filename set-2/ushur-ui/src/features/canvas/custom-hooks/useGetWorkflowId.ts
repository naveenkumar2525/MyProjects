import useUrlSearchParams from "../../../custom-hooks/useUrlSearchParams";

const useGetWorkflowId = () => {
  let { workflowId } = useUrlSearchParams();
  if (process.env.REACT_APP_MOCK_SERVER === "MSW") {
    workflowId = "someWorkflow";
  }
  return workflowId;
};

export default useGetWorkflowId;
