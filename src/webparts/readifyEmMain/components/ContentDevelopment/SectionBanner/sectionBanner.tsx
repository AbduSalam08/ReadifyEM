/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useState } from "react";
import { CONFIG, LISTNAMES } from "../../../../../config/config";
import SpServices from "../../../../../services/SPServices/SpServices";
import styles from "./SectionBanner.module.scss";
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
  console.log("imgURL: ", imgURL);

  const getHeaderSectionDetails = async (): Promise<any> => {
    let HeaderID: any = "";
    await SpServices.SPReadItems({
      Listname: LISTNAMES.SectionDetails,
      Select: "*",
      Filter: [
        {
          FilterKey: "documentOf",
          Operator: "eq",
          FilterValue: sectionDetails?.documentOfId,
        },
        {
          FilterKey: "sectionType",
          Operator: "eq",
          FilterValue: "header section",
        },
      ],
    })
      .then((res: any) => {
        console.log("res: ", res);
        HeaderID = res[0]?.ID;
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });

    await SpServices.SPGetAttachments({
      ID: HeaderID,
      Listname: LISTNAMES.SectionDetails,
    })
      .then((res: any) => {
        console.log("res2: ", res);
        if (res[0]?.ServerRelativeUrl) {
          setImgURL(`${CONFIG.tenantURL}${res[0]?.ServerRelativeUrl}`);
        } else {
          setImgURL("");
        }
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  useEffect(() => {
    getHeaderSectionDetails();
  }, []);
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
              !appendixHeader
                ? `Version: ${currentDocDetails.version || "-"}`
                : secondaryTitle
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
