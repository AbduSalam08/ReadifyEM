/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DefaultButton from "../../common/Buttons/DefaultButton";
import styles from "./ContentTypeConfirmation.module.scss";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../common/Toast/ToastMessage";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateSectionDataLocal } from "../../../../../utils/contentDevelopementUtils";

interface IContentTypeConfirmationProps {
  setSectionData?: any;
  customWrapperClassName?: any;
  activeIndex?: any;
  currentDocRole?: any;
  noActionBtns?: any;
  sectionID?: any;
  currentSectionData?: any;
}

const ContentTypeConfirmation = ({
  setSectionData,
  customWrapperClassName,
  activeIndex,
  currentDocRole,
  noActionBtns,
  sectionID,
  currentSectionData,
}: IContentTypeConfirmationProps): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sectionLoader, setSectionLoader] = useState(false);
  const [toastMessage, setToastMessage] = useState<any>([]);
  const pageDetailsState: any = useSelector(
    (state: any) => state?.MainSPContext?.PageDetails
  );
  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const addData = async (submissionType?: any): Promise<any> => {
    setSectionLoader(true);

    let currentItemsAttachments: any;

    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.SectionDetails,
      ID: sectionID,
    })
      .then((res: any) => {
        currentItemsAttachments = res;
      })
      .catch((err: any) => {
        console.log("Error : ", err);
      });

    let updateAttachmentPromise: any;

    if (currentItemsAttachments?.length > 0) {
      updateAttachmentPromise = await SpServices.SPDeleteAttachments({
        ListID: sectionID,
        ListName: LISTNAMES.SectionDetails,
        AttachmentName: "Sample.txt",
      });
    }

    const updateSectionsContentType: any = await SpServices.SPUpdateItem({
      ID: sectionID,
      Listname: LISTNAMES.SectionDetails,
      RequestJSON: {
        typeOfContent: "initial",
      },
    });

    const updateArray = updateSectionDataLocal(AllSectionsDataMain, sectionID, {
      contentType: "initial",
      sectionSubmitted: false,
    });

    dispatch(setCDSectionData([...updateArray]));

    Promise.all([updateAttachmentPromise, updateSectionsContentType])
      .then((res: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });
      })
      .catch((err: any) => {
        setToastMessage({
          isShow: true,
          severity: "error",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
        setSectionLoader(false);
      });
  };

  return (
    <div className={`${styles.initialContent} ${customWrapperClassName}`}>
      {!sectionLoader ? (
        <div
          style={{
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {currentDocRole?.primaryAuthor || currentDocRole?.sectionAuthor ? (
            currentSectionData?.sectionSubmitted ? (
              <p className={styles.emptyMsg}>
                <AccessTimeIcon
                  style={{
                    width: "18px",
                  }}
                />
                No content has been developed at this time.
              </p>
            ) : (
              <div className={styles.contentTypeBox}>
                <>
                  <span>Please select the content type</span>
                  <div className={styles.actionsBtns}>
                    <DefaultButton
                      btnType="primary"
                      text={"List"}
                      onClick={() => {
                        const updateArray = updateSectionDataLocal(
                          AllSectionsDataMain,
                          sectionID,
                          {
                            contentType: "list",
                            sectionSubmitted: false,
                          }
                        );

                        dispatch(setCDSectionData([...updateArray]));

                        setSectionData((prev: any) => {
                          const updatedSections = [...prev];
                          updatedSections[activeIndex] = {
                            ...updatedSections[activeIndex],
                            contentType: "list",
                          };
                          return updatedSections;
                        });
                      }}
                    />
                    <DefaultButton
                      btnType="primary"
                      text={"Paragraph"}
                      onClick={() => {
                        const updateArray = updateSectionDataLocal(
                          AllSectionsDataMain,
                          sectionID,
                          {
                            contentType: "paragraph",
                            sectionSubmitted: false,
                          }
                        );

                        dispatch(setCDSectionData([...updateArray]));

                        setSectionData((prev: any) => {
                          const updatedSections = [...prev];
                          updatedSections[activeIndex] = {
                            ...updatedSections[activeIndex],
                            contentType: "paragraph",
                          };
                          return updatedSections;
                        });
                      }}
                    />
                  </div>
                </>
              </div>
            )
          ) : (
            <p className={styles.emptyMsg}>
              <AccessTimeIcon
                style={{
                  width: "18px",
                }}
              />
              No content has been developed at this time.
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularSpinner />
        </div>
      )}
      {!noActionBtns && (
        <div
          style={{
            width: "100%",
            // height: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            // marginTop: "15px",
            padding: "10px",
          }}
        >
          {/* <button className={"helpButton"}>Help?</button> */}
          <a
            className={"helpButton"}
            href={
              pageDetailsState.helpLink.startsWith("https://")
                ? encodeURI(pageDetailsState.helpLink)
                : encodeURI("https://" + pageDetailsState.helpLink)
            }
            target="_blank"
          >
            Help?
          </a>
          <div style={{ display: "flex", gap: "15px" }}>
            <DefaultButton
              text="Close"
              btnType="darkGreyVariant"
              onClick={() => {
                navigate(-1);
              }}
            />
            <DefaultButton
              text="Save"
              // disabled={currentSectionData?.contentType}
              btnType="lightGreyVariant"
              onClick={async () => {
                await addData();
              }}
              disabled
            />
            <DefaultButton text="Submit" btnType="primary" disabled />
          </div>
        </div>
      )}
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
    </div>
  );
};

export default ContentTypeConfirmation;
