import React, { useState, useEffect } from "react";
import "./CreateRulesetModal.css";
//@ts-ignore
import { Modal, Input } from "@ushurengg/uicomponents";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { createRuleset, updateRuleset } from "./rulesetSlice";
import { useAppDispatch } from "../../app/hooks";

type CreateModalProps = {
  open: boolean;
  onClose: any;
  rulesetid?: string;
  rulesetname?: string;
  rulesetdescription?: string;
};

const CreateRulesetModal = (props: CreateModalProps) => {
  const dispatch = useAppDispatch();
  const { open, onClose, rulesetid, rulesetname, rulesetdescription } = props;
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [modalTitle, setModalTitle] = useState("Create Ruleset");
  const [isSuccess, setSuccess] = useState(false);
  const [validated, setValidated] = useState({ name: true });
  useEffect(() => {
    if (rulesetname) {
      setName(rulesetname);
      setModalTitle("Edit Ruleset");
    }
    if (rulesetdescription) setDesc(rulesetdescription);
  }, [rulesetname, rulesetdescription]);

  const onSubmit = () => {
    let validatedObj: any;
    let overallValidationPassed = true;

    //We can add more attributes as and when required here
    let namevalidation = name != "";
    overallValidationPassed = namevalidation;
    validatedObj = { ...validated, ...{ name: namevalidation } };

    setValidated(validatedObj);

    if (!overallValidationPassed) return;
    if (rulesetid) {
      dispatch(
        updateRuleset({
          rulesetId: rulesetid,
          rulesetName: name,
          description: desc,
        })
      ).then((resultset: any) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose("Success");
        }, 2000);
      });
    } else {
      dispatch(
        createRuleset({ rulesetName: name, description: desc, ruleJson: [] })
      ).then((resultset: any) => {
        const rulesetid =
          resultset && resultset.payload && resultset.payload.rulesetId
            ? resultset.payload.rulesetId
            : "";
        if (rulesetid != "")
          location.href = "?page=edit_ruleset&rulesetid=" + rulesetid;
        onClose("Success");
        setTimeout(() => {
          setName("");
          setDesc("");
          setSuccess(false);
          onClose("Success");
        }, 2000);
      });
    }
  };
  const onCancel = () => {
    if(!rulesetid){
      setName("");
      setDesc("");
    }else{
      setName(String(rulesetname));
      setDesc(String(rulesetdescription));
    }
    
    onClose();
  };
  let actions: any = isSuccess
    ? []
    : [
        {
          onClick: onSubmit,
          text: rulesetname ? "Save" : "Create Ruleset",
          type: "primary",
        },
      ];

  return (
    <>
      <Modal
        actions={actions}
        className="new-modal"
        onHide={onCancel}
        title={modalTitle}
        showModal={open}
      >
        {isSuccess ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              fontSize: 40,
              color: "green",
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} color="green" size={"lg"} />
            {rulesetid ? (
              <div>Ruleset Updated</div>
            ) : (
              <div>Ruleset Created</div>
            )}
          </div>
        ) : (
          <>
            {" "}
            <Input
              label="Enter Ruleset Name"
              error={!validated.name}
              value={name}
              handleInputChange={(ev: any) => {
                let isvalid = ev.target.value !== "";
                let validatedObj = { name: isvalid };
                validatedObj = { ...validated, ...validatedObj };
                setValidated(validatedObj);
                setName(ev.target.value);
              }}
            />
            <Input
              label="Enter Ruleset Description"
              type="text"
              value={desc}
              handleInputChange={(ev: any) => setDesc(ev.target.value)}
            />
          </>
        )}
        <div style={{ marginTop: 20 }} />
      </Modal>
    </>
  );
};

export default CreateRulesetModal;
