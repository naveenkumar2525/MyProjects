import React, { useState, useEffect, useRef } from "react";
// @ts-ignore
import {
  Input,
  Checkbox,
  // @ts-ignore
} from "@ushurengg/uicomponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Switch from "../../components/Switch.react";
import DropFile from "../../components/DropFile.react";
import ColorPicker from "../../components/ColorPicker.react";
import Select from "../../components/Select.react";
import SaveChangesRibbon from "./SaveChangesRibbon.react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createPortalAndGet,
  getHubsSettingsAsync,
  getJsonConfigForPortalAsync,
  hubSettings,
  hubsList,
  jsonConfigForPortal,
  saveSettingsResp,
  updateHubsSettingsAsync,
} from "./hubSettingsSlice";
import { base64StringForImage } from "../../utils/helpers.utils";
import GeneralSettingsAlert from "./GeneralSettingsAlert.react";
import { getHostName } from "../../utils/api.utils";
import UrlCopy from "./UrlCopy.react";
import { getJsonConfigForPortal } from "./hubSettingsAPI";

const backgroundStyles = [
  {
    id: "solid",
    label: "Solid",
    background: (color: string) => color,
  },
  {
    id: "lg-top-bottom",
    label: "Gradient (top -> bottom)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to bottom, ${color1}, ${color2})`,
  },
  {
    id: "lg-left-right",
    label: "Gradient (left -> right)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to right, ${color1}, ${color2})`,
  },
  {
    id: "lg-bottom-top",
    label: "Gradient (bottom -> top)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to top, ${color1}, ${color2})`,
  },
  {
    id: "lg-right-left",
    label: "Gradient (right -> left)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to left, ${color1}, ${color2})`,
  },
  {
    id: "lg-top_left-bottom_right",
    label: "Gradient (top left -> bottom right)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to bottom right, ${color1}, ${color2})`,
  },
  {
    id: "lg-bottom_right-top_left",
    label: "Gradient (bottom right -> top left)",
    background: (color1: string, color2: string) =>
      `linear-gradient(to top left, ${color1}, ${color2})`,
  },
];

const defaults = {
  isActive: true,
  hubUrl: "",
  offlineMessage:
    "Invisible Portal is currently down or under maintenance. Please check back later.",
  solidColor: "#4496C4",
  gradientFromColor: "#0E4C7A",
  gradientToColor: "#4496C4",
  backgroundColor: "",
  logoFile: "",
  base64Logo: "",
  backgroundStyle: "solid",
  displayPortalName: true,
  displayPortalDescription: true,
  portalName: "",
  portalDescription: "",
  descCharCount: 280,
  isCopyUrlActive: false,
  footerMessage: false,
  requireMFA: false
};

const MESSAGES = {
  mfaDescription: "When Multi-Factor-Authentication (MFA) is enabled, users will be asked to enter a security code sent to their email on file for added security verification."
};

const GeneralSettings = () => {
  const dispatch = useAppDispatch();
  const hubs = useAppSelector(hubsList);
  const settings = useAppSelector(hubSettings);
  const saveResp = useAppSelector(saveSettingsResp);
  const jsonConfig = useAppSelector(jsonConfigForPortal);

  const [isActive, setIsActive] = useState(defaults.isActive);
  const [hubUrl, setHubUrl] = useState(defaults.hubUrl);
  const [offlineMessage, setOfflineMessage] = useState(defaults.offlineMessage);
  const [solidColor, setSolidColor] = useState(defaults.solidColor);
  const [fromColor, setFromColor] = useState(defaults.gradientFromColor);
  const [toColor, setToColor] = useState(defaults.gradientToColor);
  const [backgroundColor , setBackgroundColor] = useState(defaults.backgroundColor);
  const [logoFile, setLogoFile]: any = useState(defaults.logoFile);
  const [base64Logo, setBase64Logo]: any = useState(defaults.base64Logo);
  const [isCopyUrlActive, setIsCopyUrlActive] = useState<boolean>(defaults.isCopyUrlActive);
  const [backgroundStyle, setBackgroundStyle] = useState(
    defaults.backgroundStyle
  );
  const [changes, setChanges] = useState(new Set());

  const [displayPortalName, setDisplayPortalName] = useState(
    defaults.displayPortalName
  );
  const [displayPortalDescription, setdDisplayPortalDescription] = useState(
    defaults.displayPortalDescription
  );
  const [portalName, setPortalName] = useState(defaults.portalName);
  const [portalDescription, setPortalDescription] = useState(
    defaults.portalDescription
  );
  const [descCharCount, setDescCharCount] = useState<number>(defaults.descCharCount);
  const [isPortalNameEmpty , setIsPortalNameEmpty] = useState<boolean>(false);
  const [footerMessage, setFooterMessage] = useState(defaults.footerMessage);
  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean>(defaults.requireMFA);
  const scrollToRef = useRef<any>({});  

  useEffect(() => {
    dispatch(getJsonConfigForPortalAsync());
    dispatch(createPortalAndGet({ name: "Portal Name", description: "Portal Description" }));
  }, []);

  useEffect(() => {
    const id = hubs?.[0]?.id;
    if (id) {
      setHubUrl(`${jsonConfig?.InvisiblePortalHostname ?? ""}/ip/${id}`);
    }
  }, [jsonConfig]);

  useEffect(() => {
    const id = hubs?.[0]?.id;
    if (id) {
      dispatch(getHubsSettingsAsync({ id }));
      setHubUrl(`${jsonConfig?.InvisiblePortalHostname ?? ""}/ip/${id}`);

      const [
        {
          name = defaults.portalName,
          description = defaults.portalDescription,
        },
      ] = hubs;
      setPortalName(name);
      setPortalDescription(description);
    }
  }, [hubs]);

  useEffect(() => {
    if (saveResp?.status === "success") {
      setChanges(new Set());
      const id = hubs?.[0]?.id;
      if (id) {
        dispatch(getHubsSettingsAsync({ id }));
      }
    }
  }, [saveResp]);

  const resetChanges = () => {

    if (settings?.brandColors?.length > 1) {
       setFromColor(settings?.brandColors?.[0] ?? defaults.gradientFromColor);
       setToColor(settings?.brandColors?.[1] ?? defaults.gradientToColor);
    } else setSolidColor(settings?.brandColors?.[0] ?? defaults.solidColor);

    setIsCopyUrlActive(Object.keys(settings).length ? true : defaults.isCopyUrlActive);
    setIsActive(settings?.isActive ?? defaults.isActive);
    setOfflineMessage(settings?.offlineMessage ?? defaults.offlineMessage);
    setBackgroundStyle(settings?.backgroundStyle ?? defaults.backgroundStyle);
    setBase64Logo(settings?.base64Logo ?? defaults.base64Logo);
    setDisplayPortalName(
      settings?.displayPortalName ?? defaults.displayPortalName
    );
    setdDisplayPortalDescription(
      settings?.displayPortalDescription ?? defaults.displayPortalDescription
    );
    setIsMfaEnabled(settings?.requireMFA || defaults.requireMFA);
    setLogoFile(defaults.logoFile);
    setFooterMessage(settings?.footerMessage ?? defaults.footerMessage);
    setChanges(new Set());
  };

  useEffect(resetChanges, [settings]);

  useEffect(()=>{     //finding color based on the background style

    let color;

    if(backgroundStyle === 'solid'){

      color = backgroundStyles
         .find((item: any) => item.id === backgroundStyle)
         ?.background(solidColor, "");
      setBackgroundColor(color!);
    }
    else{
      color = backgroundStyles
         .find((item: any) => item.id === backgroundStyle)
         ?.background(fromColor, toColor);
      setBackgroundColor(color!);
    }
  }, [backgroundStyle, solidColor, fromColor, toColor]);

  useEffect(() => {       //updating characters count as we type portal description.
    setDescCharCount(defaults.descCharCount - portalDescription.length);
  }, [portalDescription]);

  const onSaveSettings = async () => {

    if (portalName === "") {
      setIsPortalNameEmpty(true);
      scrollToRef.current.scrollIntoView();
    } else {
      const id = hubs?.[0]?.id ?? "";
      const payload: { [key: string]: any } = {
        id,
        isActive,
        hubUrl,
        offlineMessage,
        brandColors:
          backgroundStyle === "solid" ? [solidColor] : [fromColor, toColor],
        backgroundStyle,
        base64Logo,
        displayPortalName,
        displayPortalDescription,
        portalName,
        portalDescription,
        footerMessage,
        requireMFA: isMfaEnabled
      };
      dispatch(updateHubsSettingsAsync(payload));
    }
    
  };

  const handleFirstColorPicker = (color:string)=>{

    if(backgroundStyle === 'solid')
      setSolidColor(color);
    else setFromColor(color);
  
    setChanges(changes.add("firstColor"));
  }

  const onChangeShowPortalName = () => {
    setDisplayPortalName(!displayPortalName);
    setChanges(changes.add("displayPortalName"));
  };

  const onChangeShowPortalDescription = () => {
    setdDisplayPortalDescription(!displayPortalDescription);
    setChanges(changes.add("displayPortalDescription"));
  };

  const onFooterMessageChange = () => {
    if (changes.has('footerMessage')) {
      changes.delete('footerMessage');
    }
    else {
      changes.add('footerMessage');
    }

    setFooterMessage(!footerMessage);
    setChanges(changes);
  };

  return (
    <div className="bg-white mt-3 py-4 px-2 rounded-lg">
      <GeneralSettingsAlert />
      <div className="grid grid-cols-2">
        <div className="p-2">
          <p className="text-lg font-semibold" ref = {scrollToRef}>
            Name and description in Portal home page
          </p>
          {/* <div className="grid grid-cols-2">
            <div>
              <Checkbox
                checked={displayPortalName}
                label="Show Portal name"
                handleOnChange={onChangeShowPortalName}
                onClick={onChangeShowPortalName}
              />
            </div>
            <div>
              <Checkbox
                checked={displayPortalDescription}
                label="Show Portal description"
                handleOnChange={onChangeShowPortalDescription}
                onClick={onChangeShowPortalDescription}
              />
            </div>
          </div> */}
          <Input
            label="Portal name"
            value={portalName}
            error={isPortalNameEmpty}
            tooltipText={
              isPortalNameEmpty ? "Portal name cannot be empty" : ""
            }
            handleInputChange={(ev: any) => {
              setIsPortalNameEmpty(false);
              setPortalName(ev.target.value);
              setChanges(changes.add("portalName"));
            }}
          />
          <Input
            type="textarea"
            textAreaRows={5}
            label="Portal description"
            value={portalDescription}
            maxLength = {defaults.descCharCount}
            handleInputChange={(ev: any) => {
              setPortalDescription(ev.target.value);
              setChanges(changes.add("portalDescription"));
            }}
          />
          <p className="ushur-text text-gray-400">{descCharCount} characters remaining</p>
          <p className="mt-2 text-lg font-semibold">
            Activate or Deactivate Invisible Portal
          </p>
          <div className="flex p-2">
            <Switch
              toggle={isActive}
              disabled = {false}
              onChange={() => {
                setIsActive(!isActive);
                setChanges(changes.add("isActive"));
              }}
            />
            <p className="text-sm text-gray-400 pl-2">
              If the Invisible Portal is inactive, all traffic will be redirected to a
              maintenance page. Only deactivate the Invisible Portal if you need to disable
              it for any reason.
            </p>
          </div>
          <UrlCopy label="Portal URL" url={hubUrl} active={isCopyUrlActive} />
          <div className="mt-4" />
          <Input
            type="textarea"
            textAreaRows={3}
            label="Message to display when Invisible Portal is inactive"
            value={offlineMessage}
            handleInputChange={(ev: any) => {
              setOfflineMessage(ev.target.value);
              setChanges(changes.add("offlineMessage"));
            }}
            placeholder={
              "Invisible Portal is currently down or under maintenance. Please check back later."
            }
          />

          <div className="mt-4 px-2 rounded-lg">
            <p className="text-lg font-semibold">Multi-Factor-Authentication (MFA)</p>

            <Checkbox
              disabled={false}
              checked={isMfaEnabled}
              label="Enable MFA"
              handleOnChange={() => {
                setChanges(changes => {
                  if (changes.has('mfa')) {
                    changes.delete('mfa');
                  }
                  else {
                    changes.add('mfa');
                  }

                  return changes;
                });
                setIsMfaEnabled((prev) => !prev);
              }}
            />
            <div className="pl-4">
              <p className="ml-2 text-sm text-gray-400">
                {MESSAGES.mfaDescription}
              </p>
            </div>
          </div>

          <p className="mt-4 mb-2 text-lg font-semibold">Branding</p>

          <DropFile
            label="Upload Logo"
            supportedText={
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip className="logo-spec-tooltip">
                    <div className="logo-spec-tooltip-content">
                      <span>Supported formats: .img, .jpg, .gif, .png</span><br />
                      <span>Max dimensions: 320px(width) by 70px(height)</span><br />
                      <span>Max file size: 200kb</span><br />
                      <span>Max number of files: 1</span>
                    </div>
                  </Tooltip>
                }>
                {({ ref, ...triggerHandler }) => (
                  <span>
                    <span
                      style={{ marginRight: '2px' }}
                      {...triggerHandler}>
                      Logo specifications
                    </span>
                    
                    <span ref={ref} {...triggerHandler}>
                      <FontAwesomeIcon
                        icon={faInfoCircle as IconProp}
                        size={"sm"}
                      />
                    </span>
                  </span>
                )}
              </OverlayTrigger>
            }
            onChange={async (file: any) => {
              setLogoFile(file);
              setChanges(changes.add("logo"));
              setBase64Logo(await base64StringForImage(file));
            }}
          />

          <div className="mt-2" />
          <div className="grid grid-cols-2">
            <Select
              items={backgroundStyles}
              value={backgroundStyle}
              onChange={(sty) => {
                setBackgroundStyle(sty);
                setChanges(changes.add("backgroudStyle"));
              }}
              title="Background Style"
            />
          </div>
          <div className="mt-2" />
          <div className="grid grid-cols-2 gap-x-2">
            <ColorPicker
              color={backgroundStyle === "solid" ? solidColor :  fromColor}
              onChangeColor={handleFirstColorPicker}
              title={
                backgroundStyle === "solid"
                  ? "Brand Color"
                  : "Gradient Start Color"
              }
            />
            {backgroundStyle !== "solid" && (
              <ColorPicker
                color={toColor}
                onChangeColor={(col) => {
                  setToColor(col);
                  setChanges(changes.add("toColor"));
                }}
                title="Gradient End Color"
              />
            )}
          </div>

          <div className="mt-2" />

          <span className="ushur-label form-label">Footer message</span>
          <Checkbox
            id="footerMessageCheckbox"
            checked={footerMessage}
            label='Show a shield icon and "Powered by Ushur" text in the footer of all Invisible Portal pages.'
            handleOnChange={onFooterMessageChange}
          />
        </div>
        <div className="p-2" style={{ height: "100%" }}>
          <p className="text-lg font-semibold">Preview</p>
          <div
            className="grid place-items-center relative"
            style={{
              height: "calc(100% - 40px)",
              minHeight: 500,
              background: backgroundColor
            }}
          >
            <img
              className="absolute"
              style={{
                top: 12,
                left: 12,
                height: 70,
                maxWidth: 300,
              }}
              src={base64Logo}
            ></img>
            <div className="grid grid-cols-3 gap-3 w-2/4 h-2/4">
              <div className="col-span-1 bg-white"></div>
              <div className="col-span-2 bg-white"></div>
            </div>
          </div>
        </div>
      </div>
      <SaveChangesRibbon
        onSave={onSaveSettings}
        onCancel={resetChanges}
        changesCount={changes?.size}
      />
    </div>
  );
};

export default GeneralSettings;
