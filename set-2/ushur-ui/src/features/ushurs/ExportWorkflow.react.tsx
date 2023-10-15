import React, { useState } from "react";
//@ts-ignore
import { Modal, Input } from "@ushurengg/uicomponents";
import { Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ExportWorkflows } from "../../features/ushurs/ushursAPI";
import { getExportWorkflow } from "../../features/ushurs/ushursSlice";

type ExportModalProps = {
    open: boolean;
    onClose: any;
    campaignId: any;
};

const defaults = {
    existing: true,
    isSuccess: false,
};

const ExportWorkflowModal = (props: ExportModalProps) => {
    const dispatch = useAppDispatch();
    const { open, onClose, campaignId } = props;
    const [isSuccess, setSuccess] = useState(defaults.isSuccess);
    const [isEnabledEnterprise, setIsEnabledEnterprise] = useState(true);
    const [isEnabledDataExt, setIsEnabledDataExt] = useState(true);
    const [isEnabledTopics, setIsEnabledTopics] = useState(true);

    const data = {
        campaignId_: campaignId,
        exportDataExRules_: isEnabledDataExt,
        exportEnterpriseVariables_: isEnabledEnterprise,
        exportTopics_: isEnabledTopics,
    }

    const resetFields = () => {
        setIsEnabledEnterprise(true);
        setIsEnabledDataExt(true);
        setIsEnabledTopics(true);
    };

    const onSubmit = async () => {
        await dispatch(getExportWorkflow(data));
    };

    const onCancel = () => {
        resetFields();
        onClose();
    };

    return (
        <>
            <Modal
                actions={[
                    {
                        onClick: onSubmit,
                        text: "Export Workflow",
                        type: "primary",
                    },
                ]}
                className="new-modal"
                onHide={onCancel}
                title="Export Workflow"
                size="lg"
                subTitle="Export your workflow into a .ufo file format."
                showModal={open}
                closeLabel={isSuccess ? "Close" : "Cancel"}
            >
                <>
                    <div style={{ margin: '15px' }}>
                        <label className="ushur-label form-label mt-10">Select Workflow components to export </label>
                        <Form.Check
                            type='checkbox'
                            id="export-check"
                            label="Workflow variable"
                            name="Workflow variable"
                            disabled={true}
                            checked={true}
                        />
                        <Form.Check
                            type='checkbox'
                            id="export-check"
                            label="Enterprise variables"
                            name="Enterprise variables"
                            onChange={() => setIsEnabledEnterprise(!isEnabledEnterprise)}
                            checked={isEnabledEnterprise}
                        />
                        <Form.Check
                            type='checkbox'
                            id="export-check"
                            label="Data Extraction rules"
                            name="Data Extraction rules"
                            onChange={() => setIsEnabledDataExt(!isEnabledDataExt)}
                            checked={isEnabledDataExt}
                        />
                        <Form.Check
                            type='checkbox'
                            id="export-check"
                            label="Topics and phrases"
                            name="Topics and phrases"
                            onChange={() => setIsEnabledTopics(!isEnabledTopics)}
                            checked={isEnabledTopics}
                        />
                    </div>
                </>
                <div style={{ marginTop: 20 }} />

            </Modal>
        </>
    );
};

export default ExportWorkflowModal;