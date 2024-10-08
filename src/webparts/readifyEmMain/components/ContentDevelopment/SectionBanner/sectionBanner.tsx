/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useState } from "react";
import styles from "./SectionBanner.module.scss";
import {
  // getAppendixHeaderSectionDetails,
  getHeaderSectionDetails,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import { useDispatch, useSelector } from "react-redux";
import { removeVersionFromDocName } from "../../../../../utils/formatDocName";
import { ChevronRight } from "@mui/icons-material";
const sampleDocHeaderImg: any = require("../../../../../assets/images/png/imagePlaceholder.png");

interface Props {
  sectionDetails: any;
  currentDocDetails: any;
  appendixHeader: any;
  secondaryTitle?: any;
  lastReviewDate: any;
}

const SectionBanner: React.FC<Props> = ({
  sectionDetails,
  currentDocDetails,
  appendixHeader,
  secondaryTitle,
  lastReviewDate,
}) => {
  const [imgURL, setImgURL] = useState<string>("");
  const dispatch = useDispatch();
  const CDHeaderDetails = useSelector(
    (state: any) => state.ContentDeveloperData.CDHeaderDetails
  );
  const [headerToggle, setHeaderToggle] = useState(false);

  // UseEffect to fetch header details based on section type
  useEffect(() => {
    // if (sectionDetails?.sectionType === "appendix section") {
    //   getAppendixHeaderSectionDetails(sectionDetails, dispatch);
    // } else {
    getHeaderSectionDetails(sectionDetails, dispatch);

    if (sectionDetails?.sectionType === "header section") {
      setHeaderToggle(true);
    } else {
      setHeaderToggle(false);
    }

    // }
  }, [
    sectionDetails,
    sectionDetails?.ID,
    sectionDetails?.sectionType,
    dispatch,
  ]);

  // UseEffect to set image URL when CDHeaderDetails or sectionDetails changes
  useEffect(() => {
    setImgURL(CDHeaderDetails?.imgURL);
  }, [CDHeaderDetails, sectionDetails]);

  return (
    <div
      style={{
        position: "relative",
        margin: headerToggle ? "0" : "15px 0",
      }}
    >
      {sectionDetails?.sectionType !== "header section" && (
        <div
          className={`${styles.flexCenter} ${styles.bannerHeader}`}
          style={{
            position: "absolute",
            top: headerToggle ? "0" : "-10px",
            padding: headerToggle ? "0 5px" : "0 8px",
            left: "0",
            cursor: "pointer",
          }}
          onClick={() => {
            setHeaderToggle(!headerToggle);
          }}
        >
          {!headerToggle ? "Header" : ""}{" "}
          <ChevronRight
            sx={{
              fontSize: "20px",
              transform: `rotate(${headerToggle ? "90deg" : "0deg"})`,
              transition: "all .2s",
            }}
          />
        </div>
      )}
      <div
        className={styles.headerContainer}
        style={{
          height: headerToggle ? "85px" : "0px",
          padding: headerToggle ? "10px 15px" : "0",
          overflow: "hidden",
          transition: "all .2s",
        }}
      >
        <div className={styles.headerLogo}>
          <img
            src={
              CDHeaderDetails?.imgURL
                ? CDHeaderDetails?.imgURL
                : imgURL || sampleDocHeaderImg
            }
            alt="doc header logo"
          />
        </div>
        <div className={styles.headerText}>
          <p>
            {removeVersionFromDocName(currentDocDetails?.documentName) || "-"}
          </p>
          <span>
            {sectionDetails?.sectionType === "appendix section"
              ? `${
                  sectionDetails?.sectionName
                } ${` - version ${currentDocDetails.version}`}`
              : `Version: ${
                  currentDocDetails.version ||
                  CDHeaderDetails?.headerDescription ||
                  "-"
                }`}
          </span>
        </div>
        <div className={styles.bannerSecWrapper}>
          <div className={styles.bannerSec}>
            <span className={styles.docDetailsSpan1}>Type</span>
            <span className={styles.docDetailsSpan2}>
              {currentDocDetails?.documentTemplateType?.Title || "-"}
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
              {lastReviewDate?.toLowerCase() !== "invalid date"
                ? lastReviewDate
                : "-" || "-"}
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
    </div>
  );
};

export default SectionBanner;
