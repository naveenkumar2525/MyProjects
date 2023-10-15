import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ErrorAlert from "../../components/alerts/ErrorAlert.react";
import SuccessAlert from "../../components/alerts/SuccessAlert.react";
import { resetSaveWorkflowsResp, saveWorkflowsResp } from "./hubSettingsSlice";

type Props = {};

const ManageWorkflowsAlert = (props: Props) => {
  const dispatch = useAppDispatch();
  const resp = useAppSelector(saveWorkflowsResp);
  const isError = resp?.error === true || resp?.status === "failure";
  const errorMesg = resp?.infoText?.includes("Invalid Auth Token")
    ? "Your auth session is expired, Please login again and try."
    : "Something went wrong, Please try again.";
  const isSuccess = resp?.some((item: any) => item?.status === "success");

  return (
    <div className="mt-4">
      <ErrorAlert
        message={errorMesg}
        show={isError}
        setShow={() => dispatch(resetSaveWorkflowsResp({}))}
      />
      <SuccessAlert
        message="Successfully saved workflows configuration."
        show={isSuccess}
        setShow={() => dispatch(resetSaveWorkflowsResp({}))}
      />
    </div>
  );
};

export default ManageWorkflowsAlert;
