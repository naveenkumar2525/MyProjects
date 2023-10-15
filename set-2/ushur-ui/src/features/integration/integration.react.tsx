import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  Title,
  FieldButton,
  DataCard,
  Table,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import {
  InputGroup,
  Button,
  FormControl,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, InfoCircleFill } from "react-bootstrap-icons";
import IntegrationByIdModal from "./modalById.react";
import DeleteByIdModal from "./deleteByIdModal.react";
// import Cards from "./Cards";
import AdminCards from "./AdminCards";
import Cards from "./Cards";
import {
  getIntegrationAPI,
  integrations,
  getIntegrationAPIById,
  integrationById,
  deleteIntegrationAPIById,
  putIntegrationAPIById,
  patchIntegrationAPIById,
  putPatchIntegrationAPIById,
  putStatus,
  integrationsAdmin,
  getSelectiveEnabling,
} from "./integrationSlice";
import "./int.css";
import useUrlSearchParams from "../../custom-hooks/useUrlSearchParams";
import { getTokenId } from "../../utils/api.utils";
let openConfigWindow: any;

export { openConfigWindow };

const Integration = () => {
  const { page } = useUrlSearchParams();
  const integrationList = useAppSelector(integrations);
  const integrationAdminList: any = useAppSelector(integrationsAdmin);
  const putSuccessStatus = useAppSelector(putStatus);
  const integrationByIds = useAppSelector(integrationById);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [getByID, setById] = useState(0);
  const [getIntName, setIntName] = useState();
  const [getLogo, setLogo] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [ifConnected, setIfConnected] = useState(false);
  const [successStart, setSuccessStart] = useState("cancel");
  const [ifSuccessStatus, setSuccessStatus] = useState(false);
  const [ifErrorStatus, setErrorStatus] = useState(false);
  const [if500, set500] = useState(false);
  const [ifIdle, setIdle] = useState(false);
  const [ifDelStatus, setDelStatus] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [currentInt, setCurrentInt] = useState<any>({});
  const [currentCheckInt, setCurrentCheckInt] = useState<any>({});
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [activeInt, setActiveInt] = useState<any>({});
  let Admin: any = localStorage.getItem("adminUser");
  let AdminCheck = JSON.parse(Admin);
  let userView: any = localStorage.getItem("userView");
  // let userViewCheck = JSON.parse(userView);
  const [upDatePage, setUpDatePage] = useState(false);
  const [checkConection, setCheckConection] = useState("");

  openConfigWindow = (intId: any, fn: any) => {
    // Must open window from user interaction code otherwise it is likely
    // to be blocked by a popup blocker:
    const integrationId = intId,
      callbackFn = fn;
    const configWindow: any = window.open(
      undefined,
      "_blank",
      "width=600,height=600,scrollbars=no"
    );

    // Listen to popup messages'
    setUpDatePage(false);
    let updateManually = false;
    const onmessage = (e: any) => {
      if (e.data.type === "tray.configPopup.error") {
        // Handle popup error message
        configWindow.close();
      }
      if (e.data.type === "tray.configPopup.cancel") {
        configWindow.close();
      }
      if (e.data.type === "tray.configPopup.finish") {
        // Handle popup finish message
        setUpDatePage(true);
        updateManually = true;
        configWindow.close();
        setSuccessStatus(true);
        setErrorStatus(false);
        set500(false);
        setIdle(false);
        setDelStatus(false);
        setTimeout(() => dispatch(getIntegrationAPI()), 8000);
        return setTimeout(() => {
          setSuccessStatus(false);
        }, 3000);
      }
      if (e.data.type === "tray.configPopup.validate") {
        // Return validation in progress
        configWindow.postMessage(
          {
            type: "tray.configPopup.client.validation",
            data: {
              inProgress: true,
            },
          },
          "*"
        );

        setTimeout(() => {
          // Add errors to all inputs
          const errors = e.data.data.visibleValues.reduce(
            (errors: any, externalId: any) => {
              // Uncomment next line to set an error message
              // errors[externalId] = 'Custom error message';
              return errors;
            },
            {}
          );

          // Return validation
          configWindow.postMessage(
            {
              type: "tray.configPopup.client.validation",
              data: {
                inProgress: false,
                errors: errors,
              },
            },
            "*"
          );
        }, 2000);
      }
    };
    window.addEventListener("message", onmessage);

    // Check if popup window has been closed before finishing the configuration.
    // We use a polling function due to the fact that some browsers may not
    // display prompts created in the beforeunload event handler.
    const CHECK_TIMEOUT = 1000;
    const checkWindow = () => {
      if (configWindow.closed) {
        // Handle popup closing
        if (!updateManually) {
          // window.location.reload(true);

          setUpDatePage(true);
        } else {
          callbackFn(integrationId);
        }
        window.removeEventListener("message", onmessage);
      } else {
        setTimeout(checkWindow, CHECK_TIMEOUT);
      }
    };

    checkWindow();

    return configWindow;
  };

  const useHasChanged = (val: any) => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
  };

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const hasVal1Changed = useHasChanged(integrationList);

  useEffect(() => {
    if (successStart === "start") {
      setTimeout(() => {
        if (currentInt?.watchEvent) {
          setShowModal(false);
          handlePatch(getByID);
          setCurrentInt({});
          setById(0);
        } else {
          setShowModal(true);
        }
      }, 900);
    }
  }, [currentInt, getByID]);

  useEffect(() => {
    setCurrentInt(() => integrationByIds[0]);
  }, [integrationByIds]);

  const checkputSuccessStatus = () => {
    if (
      putSuccessStatus === "A connected integration cannot be disabled" ||
      checkConection === "A connected integration cannot be disabled"
    ) {
      setSuccessStatus(false);
      set500(true);
      setErrorStatus(false);
      setIdle(false);
      setDelStatus(false);
      setTimeout(() => {
        setCheckConection("");
        set500(false);
      }, 3000);
    }
    if (putSuccessStatus === "doneDel") {
      setTimeout(() => dispatch(getIntegrationAPI()), 3000);
    }
    if (putSuccessStatus === "error") {
      setSuccessStatus(false);
      setErrorStatus(true);
      set500(false);
      setIdle(false);
      setDelStatus(false);
      setTimeout(() => {
        setErrorStatus(false);
      }, 3000);
    }

    if (putSuccessStatus === "idle") {
      setIdle(true);
      setSuccessStatus(false);
      setErrorStatus(false);
      setDelStatus(false);
      set500(false);
      setTimeout(() => {
        setIdle(false);
      }, 3000);
    } else {
      setSuccessStatus(false);
      setErrorStatus(false);
    }
  };

  const handleModalClose = () => {
    setSuccessStart("cancel");
    setShowModal(false);
    setCurrentInt({});
    setById(0);
  };
  const handleIntSet = (id: any, name: any, logo: any) => {
    setSuccessStart("start");
    setShowModal(true);
    setIntName(name);
    setLogo(logo);
    setById(id);
    return;
  };
  const handleIntDelSet = (id: any, name: any) => {
    setShowModal(false);
    setIntName(name);
    localStorage.setItem("del_id", id);
    setShowDelete(true);
    id && setById(id);
  };

  const onDeleteModalClose = () => {
    setShowDisabled(false);
    setShowModal(false);
    setShowDelete(false);
    setTimeout(() => handleModalClose(), 1100);
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };
  const handleDelete = (id: any) => {
    setTimeout(() => dispatch(deleteIntegrationAPIById(id)), 200);
    checkputSuccessStatus();
    setIfConnected(false);
    onDeleteModalClose();
    setSuccessStatus(false);
    setErrorStatus(false);
    setIdle(false);
    setDelStatus(true);
    setTimeout(() => dispatch(getIntegrationAPI()), 6000);
    return setTimeout(() => {
      setDelStatus(false);
    }, 3500);
  };
  const handlePatch = (id: any) => {
    if (id) {
      checkputSuccessStatus();
      dispatch(putPatchIntegrationAPIById(id));
      // setTimeout(() => dispatch(getIntegrationAPI()), 25000);
      setCurrentInt({});
      return handleModalClose();
    }
  };

  useEffect(() => {
    AdminCheck && dispatch(getSelectiveEnabling());
  }, []);
  useEffect(() => {
    if (integrationAdminList && AdminCheck) {
      setActiveInt(integrationAdminList);
    }
  }, []);

  useEffect(() => {
    if (upDatePage) {
      setTimeout(() => dispatch(getIntegrationAPI()), 3000);
    }
    return () => {};
  }, [currentInt, upDatePage]);

  useEffect(() => {
    dispatch(getIntegrationAPI());
  }, []);

  useEffect(() => {
    if (hasVal1Changed) {
      dispatch(getIntegrationAPI());
    }
  }, [hasVal1Changed, currentInt]);

  const handleSubmit = (payload: any) => {
    if (payload) {
      checkputSuccessStatus();
      handleModalClose();
      setIfConnected(true);
      dispatch(putIntegrationAPIById(payload));
      setTimeout(() => dispatch(getIntegrationAPI()), 15000);
    }
  };

  const filteredDisplayName = () => {
    let fil;

    if (integrationList) {
      fil =
        integrationList &&
        integrationList.filter((state: any) => {
          return state.displayName
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
        });

      return fil;
    } else {
      return integrationList;
    }
  };

  return (
    <Container
      className="integration-container"
      style={{ paddingLeft: " 0 !important", marginLeft: "2rem !important" }}
    >
      {/* <Product/> */}
      <Row
        className="row2 "
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignContent: "space-evenly",
          justifyContent: "flex-start",
          alignItems: "center",
          margin: " 0 !important",
          marginLeft: "-10px important",
        }}
      >
        {!page && (
          <>
            <h1
              aria-label="Integration"
              className="integration-title"
              style={{
                display: " flex",
                alignItems: "center",
                placeContent: "center flex-start",
                justifyContent: "space-between",
                width: "auto",
              }}
            >
              Integrations <InfoCircleFill className="integration-svg" />
            </h1>
            <p
              aria-label="sub-title"
              className="sub-title "
              style={{
                display: "flex",
                marginLeft: "23%",
                justifyContent: "space-between",
                alignContent: " flex-start",

                width: "55%",
              }}
            ></p>
          </>
        )}
      </Row>
      <Row xs={2} md={4}>
        {" "}
        <Col style={{ padding: "1rem", width: "55%" }}>
          {" "}
          <Form.Label
            className="mt-2"
            htmlFor="exampleColorInput"
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span>Search</span>{" "}
            {putSuccessStatus === "idle" ? (
              <span
                style={{
                  display: "none",
                  color: "#18AF57",
                  padding: ".5rem",
                  border: "1px solid #18AF57",
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  borderRadius: "5px",
                }}
              >{`${getIntName} integration successful!`}</span>
            ) : null}
            {ifSuccessStatus &&
            !if500 &&
            !ifErrorStatus &&
            !ifDelStatus &&
            ifIdle === false ? (
              <span
                style={{
                  color: "#18AF57",
                  padding: ".5rem",
                  border: "1px solid #18AF57",
                  fontWeight: "bold",
                  fontSize: ".8rem",
                  borderRadius: "5px",
                }}
              >{`${getIntName} integration successful!`}</span>
            ) : null}
            {!ifDelStatus &&
            if500 &&
            !ifSuccessStatus &&
            !ifErrorStatus &&
            ifIdle === false ? (
              <span
                style={{
                  color: "rgb(207,64,35)",
                  padding: ".5rem",
                  border: "1px solid rgb(207,64,35)",
                  fontSize: ".8rem",
                  borderRadius: "5px",
                }}
              >{`A connected integration cannot be disabled`}</span>
            ) : null}
            {!if500 &&
            ifDelStatus &&
            !ifSuccessStatus &&
            !ifErrorStatus &&
            ifIdle === false ? (
              <span
                style={{
                  color: "rgb(207,64,35)",
                  padding: ".5rem",
                  border: "1px solid rgb(207,64,35)",
                  fontSize: ".8rem",
                  borderRadius: "5px",
                }}
              >{`${getIntName} integration disconnected!`}</span>
            ) : null}
          </Form.Label>
          <InputGroup className="mb-4" style={{ width: "50%" }}>
            <FormControl
              aria-label="integration"
              aria-describedby="basic-addon2"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" id="button-addon2">
              <Search />
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <div>
        <Row xs={2} md={4}>
          {filteredDisplayName().length > 0 ? (
            AdminCheck && userView === "n" ? (
              filteredDisplayName().map(
                (rows: any, i: number) =>
                  rows.integrationId && (
                    <AdminCards
                      key={i}
                      description={rows.description}
                      checkputSuccessStatus={checkputSuccessStatus}
                      logo={rows.logo}
                      setCurrentCheckInt={setCurrentCheckInt}
                      displayName={rows.displayName}
                      connected={rows.connected}
                      handleIntSet={handleIntSet}
                      id={rows.integrationId}
                      handlePatch={handlePatch}
                      handleDelete={handleDelete}
                      handleIntDelSet={handleIntDelSet}
                      showDisabled={showDisabled}
                      currentCheckInt={currentCheckInt}
                      integrationAdminList={integrationAdminList}
                      setCheckConection={setCheckConection}
                      set500={set500}
                    />
                  )
              )
            ) : (
              filteredDisplayName().map(
                (rows: any, i: number) =>
                  rows.integrationId && (
                    <Cards
                      key={i}
                      description={rows.description}
                      logo={rows.logo}
                      displayName={rows.displayName}
                      connected={rows.connected}
                      handleIntSet={handleIntSet}
                      id={rows.integrationId}
                      handlePatch={handlePatch}
                      handleDelete={handleDelete}
                      handleIntDelSet={handleIntDelSet}
                      showDisabled={showDisabled}
                    />
                  )
              )
            )
          ) : (
            <div className="centerItems " style={{ width: "100%" }}>
              <h4>There are no Integrations found.</h4>
            </div>
          )}
        </Row>
      </div>
      {getByID !== 0 && !showDelete && (
        <IntegrationByIdModal
          onClick={() => setShowModal(false)}
          filteredDisplayName={filteredDisplayName}
          showModal={showModal}
          handleModalClose={handleModalClose}
          integrationByIds={integrationByIds}
          getByID={getByID}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
          handlePatch={handlePatch}
          ifConnected={ifConnected}
          getIntName={getIntName}
          getLogo={getLogo}
          handleModalOpen={handleModalOpen}
          showDelete={showDelete}
          setShowModal={setShowModal}
        />
      )}
      {getByID !== 0 && getIntName && showDelete && (
        <DeleteByIdModal
          getByID={getByID}
          getIntName={getIntName}
          showDelete={showDelete}
          onModalClose={onDeleteModalClose}
          handleDelete={handleDelete}
          setShowDisabled={setShowDisabled}
          handleModalClose={handleModalClose}
        />
      )}
    </Container>
  );
};

export default Integration;
