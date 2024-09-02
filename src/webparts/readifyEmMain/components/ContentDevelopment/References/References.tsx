/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo, useEffect, useState } from "react";

import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import DefaultButton from "../../common/Buttons/DefaultButton";
import { getAllSectionDefinitions } from "../../../../../services/ContentDevelopment/SectionDefinition/SectionDefinitionServices";
import styles from "./References.module.scss";
import { useSelector } from "react-redux";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import { getCurrentLoggedPromoter } from "../../../../../utils/contentDevelopementUtils";
const closeBtn = require("../../../../../assets/images/png/close.png");
import CloseIcon from "@mui/icons-material/Close";
interface Props {
  allSectionsData: any;
  documentId: number;
  sectionId: number;
  currentSectionDetails: any;
  currentDocRole: any;
}

const References: React.FC<Props> = ({
  allSectionsData,
  documentId,
  sectionId,
  currentSectionDetails,
  currentDocRole,
}) => {
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );
  const [loader, setLoader] = useState<boolean>(false);
  const [allReferencesData, setallReferencesData] = useState<any[]>([]);

  console.log(allSectionsData);

  const getReferencesFromDefintions = () => {
    setLoader(true);
    allSectionsData.forEach(async (obj: any) => {
      if (obj.sectionName === "Definitions") {
        const tempSelectedDefinitionArray = await getAllSectionDefinitions(
          documentId,
          obj.ID
        );
        const tempArray = tempSelectedDefinitionArray.filter(
          (obj: any) => !obj.isDeleted
        );
        console.log(tempArray);
        setallReferencesData([...tempArray]);
      }
    });
    setLoader(false);
  };
  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  useEffect(() => {
    getReferencesFromDefintions();
  }, []);

  return (
    <>
      {loader ? (
        <CircularSpinner />
      ) : (
        <div className={"sectionWrapper"}>
          <div className={styles.textPlayGround}>
            <div style={{ height: "100%", overflow: "auto" }}>
              <div className={styles.TopFilters}>
                <div className={styles.definitionHeaderWrapper}>
                  <span>
                    {currentSectionDetails?.sectionSubmitted
                      ? "References"
                      : "Add References"}
                  </span>
                </div>
                <DefaultButton
                  disabled={loader}
                  btnType="primary"
                  text={"New"}
                  size="medium"
                  onClick={() => {
                    // togglePopupVisibility(setPopupController, 0, "open");
                    // setDefinitionsData(initialDefinitionsData);
                  }}
                />
              </div>
              {allReferencesData?.map((obj: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={styles.selectedReferencesSec}
                    style={{ backgroundColor: obj.isNew ? "#593ABB10" : "" }}
                  >
                    <div
                      style={{
                        width: "90%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <p className={styles.referenceTitle}>
                        {obj.referenceTitle}
                        <span>,{obj.referenceAuthorName}</span>
                      </p>
                      <a
                        href={
                          obj.referenceLink.startsWith("https://")
                            ? obj.referenceLink
                            : "https://" + obj.referenceLink
                        }
                        target="_blank"
                        className={styles.referenceLink}
                      >
                        {obj.referenceLink.startsWith("https://")
                          ? obj.referenceLink
                          : "https://" + obj.referenceLink}
                      </a>
                    </div>
                    {!currentSectionDetails?.sectionSubmitted &&
                      (currentDocRole?.primaryAuthor ||
                        currentDocRole?.sectionAuthor) && (
                        <button className={styles.closeBtn}>
                          <img
                            src={closeBtn}
                            alt={"Remove Document"}
                            // onClick={() => removeSupportingDocument(index)}
                          />
                        </button>
                      )}
                  </div>
                );
              })}
              {allReferencesData.length === 0 && (
                <div className={styles.noDataFound}>
                  <span>No Data Found</span>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              margin: "10px 0px",
              justifyContent: "space-between",
            }}
          >
            <button className={"helpButton"}>Help?</button>

            <div
              style={{
                display: "flex",
                gap: "15px",
                // margin: "10px 0px",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {ContentDeveloperStatusLabel(
                currentSectionDetails?.sectionSubmitted,
                currentSectionDetails?.sectionReviewed,
                currentSectionDetails?.sectionApproved,
                currentSectionDetails?.sectionRework,
                currentDocDetailsData,
                currentDocRole,
                loggerPromoter
              )}

              {/* {currentSectionDetails?.sectionSubmitted && (
              <SecondaryTextLabel
                icon={
                  <AccessTimeIcon
                    style={{
                      width: "17px",
                    }}
                  />
                }
                text="yet to be reviewed"
              />
            )} */}

              <DefaultButton
                text={<CloseIcon sx={{ Padding: "0px" }} />}
                btnType="darkGreyVariant"
                onlyIcon={true}
                title="Close"
                onClick={() => {
                  // setCheckChanges(false);
                  // navigate(-1);
                }}
              />
              {/* <CloseIcon
              onClick={() => {
                navigate(-1);
              }}
            /> */}
              <DefaultButton
                text="Preview"
                btnType="secondaryBlue"
                onClick={() => {
                  // togglePopupVisibility(
                  //   setPopupController,
                  //   5,
                  //   "open",
                  //   "Preview"
                  // );
                }}
              />
              {/* {currentDocDetailsData?.version !== "1.0" &&
                !currentDocRole?.reviewer &&
                !currentDocRole?.consultant &&
                !currentDocRole?.approver &&
                !currentSectionDetails?.sectionSubmitted && (
                  <DefaultButton
                    text="Change record"
                    btnType="primaryGreen"
                    onClick={() => {
                      togglePopupVisibility(
                        setPopupController,
                        3,
                        "open",
                        "Change record"
                      );
                    }}
                  />
                )} */}

              {(currentDocRole?.primaryAuthor ||
                currentDocRole?.sectionAuthor ||
                currentDocRole?.reviewer ||
                currentDocRole?.approver) && (
                <>
                  {currentDocRole?.primaryAuthor
                    ? currentSectionDetails?.sectionSubmitted && (
                        <DefaultButton
                          text="Rework"
                          btnType="secondaryRed"
                          disabled={
                            ![
                              "in development",
                              "approved",
                              "in rework",
                            ].includes(
                              currentDocDetailsData?.documentStatus?.toLowerCase()
                            )
                          }
                          // onClick={() =>
                          // togglePopupVisibility(
                          //   setPopupController,
                          //   1,
                          //   "open",
                          //   "Reason for rejection"
                          // )
                          // }
                        />
                      )
                    : (currentDocRole?.reviewer ||
                        currentDocRole?.approver) && (
                        <>
                          {
                            <DefaultButton
                              text={
                                currentDocRole?.reviewer
                                  ? "Review"
                                  : currentDocRole?.approver && "Approve"
                              }
                              disabled={
                                currentSectionDetails?.sectionSubmitted &&
                                !currentSectionDetails?.sectionRework &&
                                ((currentDocRole?.reviewer &&
                                  !currentSectionDetails?.sectionReviewed) ||
                                  (currentDocRole?.approver &&
                                    !currentSectionDetails?.sectionApproved)) &&
                                loggerPromoter?.status !== "completed"
                                  ? false
                                  : true
                              }
                              btnType="primary"
                              onClick={() => {
                                // togglePopupVisibility(
                                //   setPopupController,
                                //   4,
                                //   "open",
                                //   `Are you sure want to mark this section as ${
                                //     currentDocRole?.reviewer
                                //       ? "reviewed"
                                //       : currentDocRole?.approver && "approved"
                                //   }?`
                                // );
                              }}
                            />
                          }

                          <DefaultButton
                            text="Rework"
                            btnType="secondaryRed"
                            disabled={
                              loggerPromoter?.status !== "completed"
                                ? false
                                : true
                            }
                            // onClick={() =>
                            //   togglePopupVisibility(
                            //     setPopupController,
                            //     1,
                            //     "open",
                            //     "Reason for rejection"
                            //   )
                            // }
                          />
                        </>
                      )}

                  {!currentSectionDetails?.sectionSubmitted &&
                    (currentDocRole?.sectionAuthor ||
                      currentDocRole?.primaryAuthor) && (
                      <>
                        <DefaultButton
                          text="Save"
                          btnType="lightGreyVariant"
                          onClick={async () => {
                            // await submitSectionDefinition(false);
                          }}
                        />
                        <DefaultButton
                          disabled={loader}
                          text="Submit"
                          btnType="primary"
                          onClick={() => {
                            // submitSectionDefinition(true);
                            // togglePopupVisibility(
                            //   setPopupController,
                            //   2,
                            //   "open",
                            //   "Are you sure want to submit this section?"
                            // );
                          }}
                        />
                      </>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(References);
