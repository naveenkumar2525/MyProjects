import React from 'react';
import styles from "./ProjectBrandingModal.module.css";
import { faImage } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  title: string;
  logoUrl: string;
  handleFileChange: (e: any) => void;
}

const BrandLogo = (props: Props) => {
  const { title, logoUrl, handleFileChange } = props;
  return (
    <>
      <p className="ushur-label form-label mt-2">{title}</p>
      <label htmlFor="upload-photo" className={`w-full border-solid border-1 border-light-gray-200 rounded px-5 py-4 position-relative ${styles.logoContainer}`}>
        <img src={logoUrl} className="mx-auto" />
        <div className={`${styles.logoHoverDiv} text-dark-blue text-base rounded font-thin`}>
          <FontAwesomeIcon
            icon={faImage}
            size={"lg"}
            className='mr-1 text-dark-blue'
          /> Click or drag here to change image
        </div>
      </label>
      <input type="file" name="photo" id="upload-photo" className='d-none' onChange={handleFileChange} accept="image/*" />
    </>
  );
}

export default BrandLogo;