import React, { useState, useEffect } from 'react';
import "./EngagementDescription.css";
import {
  Modal
  // @ts-ignore
} from "@ushurengg/uicomponents";

type EventProps = {
  message: string;
  moduleType: string;
  emailDetails: any;
  files: any;
};
import parse from "html-react-parser";
import { downloadAsset } from '../metadata/metadataAPI';
import { getHostName, getTokenId } from '../../utils/api.utils';
import { OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';

const EngagementDescription = (props: EventProps) => {
  const { message, moduleType, emailDetails, files } = props;
  const [fileContent, setFileContent] = useState<any>("");
  const [showAssetPreviewModal, setShowAssetPreviewModal] = useState<boolean>(false);
  const [previewErrorModal, setPreviewErrorModal] = useState<boolean>(false);

  const previewUploadedImg = async (file: any) => {
    var assetId = file.assetId;
    var fileType = file.fileType;
    var fileUrl = `${getHostName()}/rest/asset/download-asset/${assetId}?token=${getTokenId()}`;
    if (fileType.indexOf('pdf') > -1) {
      const blobUrl = await downloadAsset(assetId, 'campaignAnalytics');
      if (!blobUrl) {
        setPreviewErrorModal(true);
        return;
      } else {
        setFileContent({ type: 'iframe', url: blobUrl });
      }
    } else {
      setFileContent({ type: 'image', url: fileUrl });
    }
    setShowAssetPreviewModal(true);
  }

  const RenderEmailPreview = ({ heading, body }: any) => {
    return (
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        overlay={
          <Popover id="popover-positioned-bottom" className='engagement-timeline-popup'>
            <Popover.Body>
              <div className="resp-popover">
                <div className="resp-popover-heading">
                  {heading}
                </div>
                <div className="resp-popover-content row" dangerouslySetInnerHTML={{ __html: body }}>
                </div>
              </div>
            </Popover.Body>
          </Popover>
        }
        rootClose
      >
        <a href="javascript:void(0)">View</a>
      </OverlayTrigger>
    );
  }

  const FormResponseMessage = () => {
    try {
      const messageJSON = JSON.parse(message);
      const messageJSONKeys = Object.keys(messageJSON);
      return messageJSONKeys.map((entry: any) => {
        const responseTxt: any = messageJSON[entry];
        try {
          const uploadedAssets = JSON.parse(responseTxt.text);
          return uploadedAssets.map((asset: any) => {
            return <div className='mb-3' key={asset.assetId}><a className="cursor-pointer" onClick={() => previewUploadedImg({ assetId: asset.assetId, fileType: asset.fileType })}>{asset.fileName || 'Preview the file'}</a></div>;
          });
        } catch {
          return <div className='mb-3' key={entry}>{responseTxt.text}</div>;
        }
      })
    } catch (e) {
      return message;
    }
  }

  return (
    <>
      <div className="inline-flex">
        {
          (moduleType === 'custom-formresponse') ? (
            <div className="engagement-description">
              {FormResponseMessage()}
            </div>
          ) :
            moduleType === 'emailmessage' && !message ? (
              <div className="engagement-description">
                <div><strong>To: </strong> <span>{emailDetails?.email}</span></div>
                <div><strong>Cc: </strong><span>{emailDetails?.cc}</span></div>
                <div><strong>Bcc: </strong><span>{emailDetails?.bcc}</span></div>
                <div><strong>Subject: </strong><span>{emailDetails?.subject}</span></div>
                <div><strong>Body: </strong>
                  <RenderEmailPreview heading="Email Body" body={emailDetails?.body} />
                </div>
              </div>
            ) : moduleType === 'emailprocessing' ? (
              <div className="engagement-description">
                <div><strong>Email: </strong> <span>{emailDetails?.emailAddress}</span></div>
                <div><strong>Subject: </strong><span>{emailDetails?.emailSubject}</span></div>
                {
                  emailDetails?.emailBody && <div>
                    <strong>Body: </strong>
                    <RenderEmailPreview heading="Email Body" body={emailDetails?.emailBody} />
                  </div>
                }
              </div>
            ) : files?.length > 0 ? (
              <p className="engagement-description">
                {parse(message)}
                {
                  files.map((file: any) => {
                    // ignoring preview if multiple files are uploaded
                    return file?.fileType?.split(",")?.length === 1 ? <div>
                      <span>Uploaded File: </span>
                      <a className="cursor-pointer" onClick={() => previewUploadedImg(file)}>{file.fileName || 'Preview the file'}</a>
                    </div> : <></>
                  })
                }
              </p>
            )
              : (
                <p className="engagement-description">
                  {parse(message)}
                </p>
              )
        }
      </div>
      <Modal
        className="confrimation-modal"
        onHide={() => setShowAssetPreviewModal(false)}
        title="Preview"
        showModal={showAssetPreviewModal}
      >
        <div>
          <p className="edit-confirmation-alert">
            {fileContent.type === "image" && <img src={fileContent.url} />}
            {fileContent.type === "iframe" && <iframe width="85%" height="300px" src={fileContent.url} />}
          </p>
        </div>
      </Modal>
      <Modal
        className="confrimation-modal"
        onHide={() => setPreviewErrorModal(false)}
        title="Preview"
        showModal={previewErrorModal}
      >
        <div>
          Something went wrong while downloading asset!
        </div>
      </Modal>
    </>
  );
};

export default EngagementDescription;