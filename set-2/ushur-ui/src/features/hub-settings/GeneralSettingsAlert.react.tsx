import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ErrorAlert from "../../components/alerts/ErrorAlert.react";
import SuccessAlert from "../../components/alerts/SuccessAlert.react";
import { resetSaveSettingsResp, saveSettingsResp } from "./hubSettingsSlice";

type Props = {};

const GeneralSettingsAlert = (props: Props) => {
  const dispatch = useAppDispatch();
  const resp = useAppSelector(saveSettingsResp);
  const isError = resp?.error === true || resp?.status === "failure";
  const errorMesg = resp?.infoText?.includes("Invalid Auth Token")
    ? "Your auth session is expired, Please login again and try."
    : "Something went wrong, Please try again.";
  const isSuccess = resp?.status === "success";

  return (
    <>
      <ErrorAlert
        message={errorMesg}
        show={isError}
        setShow={() => dispatch(resetSaveSettingsResp({}))}
      />
      <SuccessAlert
        message="Successfully saved settings."
        show={isSuccess}
        setShow={() => dispatch(resetSaveSettingsResp({}))}
      />
    </>
  );
};

export default GeneralSettingsAlert;
