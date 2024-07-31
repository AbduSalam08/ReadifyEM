/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// import { CONFIG, LISTNAMES } from "../../../../../config/config";
// import SpServices from "../../../../../services/SPServices/SpServices";
import { useEffect, useState } from "react";
import styles from "./SectionBanner.module.scss";
import {
  getAppendixHeaderSectionDetails,
  getHeaderSectionDetails,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
const sampleDocHeaderImg: any = require("../../../../../assets/images/png/imagePlaceholder.png");

interface Props {
  sectionDetails: any;
  currentDocDetails: any;
  appendixHeader: any;
  secondaryTitle?: any;
}

const SectionBanner: React.FC<Props> = ({
  sectionDetails,
  currentDocDetails,
  appendixHeader,
  secondaryTitle,
}) => {
  const [imgURL, setImgURL] = useState<string>("");
  const dispatch = useDispatch();
  const CDHeaderDetails = useSelector(
    (state: any) => state.ContentDeveloperData.CDHeaderDetails
  );

  useEffect(() => {
    if (sectionDetails?.sectionType === "appendix section") {
      getAppendixHeaderSectionDetails(sectionDetails, dispatch);
    } else {
      getHeaderSectionDetails(sectionDetails, dispatch);
    }
  }, [sectionDetails]);

  useEffect(() => {
    setImgURL(CDHeaderDetails?.imgURL);
  }, [CDHeaderDetails, sectionDetails]);

  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src={imgURL || sampleDocHeaderImg} alt="doc header logo" />
        </div>
        <div className={styles.headerText}>
          <p>{currentDocDetails?.documentName || "-"}</p>
          <span>
            {`${
              // !appendixHeader
              //   ? `Version: ${currentDocDetails.version || "-"}`
              //   : CDHeaderDetails?.headerDescription
              CDHeaderDetails?.headerDescription
                ? CDHeaderDetails?.headerDescription
                : `Version: ${currentDocDetails.version || "-"}`
            }`}
          </span>
        </div>
        <div className={styles.bannerSecWrapper}>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Type</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.documentType || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Created on</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.createdDate || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Last review</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.lastReviewDate || "-"}
            </span>
          </div>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Next review</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.nextReviewDate || "-"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionBanner;
