/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./Header.module.scss";
// import Popup from "../../webparts/readifyEmMain/components/common/Popups/Popup";
import Popup from "../../../components/common/Popups/Popup";
import DefaultButton from "../../common/Buttons/DefaultButton";
import StatusPill from "../../StatusPill/StatusPill";
import { useNavigate } from "react-router-dom";
import { getUniqueTaskData } from "../../../../../services/MyTasks/MyTasksServices";
import { setConfigurePageDetails } from "../../../../../redux/features/SectionConfigurationSlice";
import { useDispatch, useSelector } from "react-redux";
import { CurrentUserIsAdmin } from "../../../../../constants/DefineUser";
import { getCurrentLoggedPromoter } from "../../../../../utils/contentDevelopementUtils";
import SpServices from "../../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../../config/config";
import { useEffect, useState } from "react";
import { removeVersionFromDocName } from "../../../../../utils/formatDocName";
import PDFServiceTemplate from "../../Table/PDFServiceTemplate/PDFServiceTemplate";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import { setSectionsAttachments } from "../../../../../redux/features/PDFServicceSlice";
const arrowBackBtn = require("../../../../../assets/images/svg/arrowBack.svg");
const locationIcon = require("../../../../../assets/images/svg/locationIcon.svg");
const editConfigurationImg = require("../../../../../assets/images/svg/taskConfigurationEditIconBlue.svg");
// const trackingPin = require("../../../../../assets/images/png/Track.png");

interface Props {
  documentName: string;
  role: any;
  documentStatus: any;
  currentDocDetailsData: any;
  onChange: (
    value: number | any,
    condition: boolean,
    popupTitle: string
  ) => void;
  currentDocRole: any;
}

const Header: React.FC<Props> = ({
  documentName,
  role,
  documentStatus,
  onChange,
  currentDocDetailsData,
  currentDocRole,
}) => {
  const dispatch = useDispatch();
  const initialPopupController = [
    {
      open: false,
      popupTitle: "View Document",
      popupWidth: "70vw",
      popupType: "custom",
      defaultCloseBtn: true,
      popupData: [],
    },
  ];

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  const popupInputs: any[] = [
    [
      <div key={3} style={{ padding: "5px" }}>
        {/* <span>Document is empty.</span> */}
        <PDFServiceTemplate
          documentId={currentDocDetailsData?.documentDetailsID}
        />
      </div>,
    ],
  ];

  const popupActions: any[] = [
    [
      {
        text: "Close",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          togglePopupVisibility(setPopupController, 0, "close");
          dispatch(setSectionsAttachments([]));
        },
      },
    ],
  ];

  console.log("documentName: ", documentName);
  console.log("currentDocDetailsData: ", currentDocDetailsData);
  // route navigator
  const navigate = useNavigate();

  const isAdmin = CurrentUserIsAdmin();
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );
  const currentApprover = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );
  console.log("currentApprover: ", currentApprover);

  const selectSection = (index: number, title: string): any => {
    onChange(index, false, title);
  };
  let PAtaskID: any;
  const getPATaskID = async (): Promise<any> => {
    await SpServices.SPReadItems({
      Listname: LISTNAMES.MyTasks,
      Filter: [
        {
          FilterKey: "documentDetails",
          Operator: "eq",
          FilterValue: currentDocDetailsData?.documentDetailsID,
        },
        {
          FilterKey: "role",
          Operator: "eq",
          FilterValue: "Primary Author",
        },
      ],
    })
      .then((res: any) => {
        console.log("res: ", res);
        PAtaskID = res[0]?.ID;
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
  };

  useEffect(() => {
    if (!currentDocDetailsData?.taskID) {
      getPATaskID();
    }
  }, [currentDocDetailsData?.taskID]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerSec}>
          <button
            className={styles.backBtn}
            onClick={() => {
              navigate(-1);
            }}
          >
            <img src={arrowBackBtn} alt={"back to my tasks"} />
          </button>
          <h3 className={styles.headerTitle}>Content Developer</h3>
          <div className={styles.documentSec}>
            <h3
              style={{
                marginRight:
                  role && role?.toLowerCase() !== "admin" ? "30px" : "0",
              }}
            >
              {removeVersionFromDocName(documentName)}
            </h3>
            {role && role?.toLowerCase() !== "admin" ? (
              <StatusPill size="SM" roles={role} />
            ) : (
              ""
            )}
            {/* <span>{role}</span> */}
          </div>
          <StatusPill size="MD" bordered={true} status={documentStatus} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* {currentDocRole?.approver &&
            currentApprover?.id ===
              currentDocDetailsData?.approvers?.length && (
              <DefaultButton
                text="Publish Document"
                btnType="primaryGreen"
                disabled={
                  currentDocDetailsData?.documentStatus?.toLowerCase() !==
                    "approved" ||
                  currentDocDetailsData?.documentStatus?.toLowerCase() !==
                    "current"
                }
                // endIcon={<img src={locationIcon} alt="track" />}
                onClick={() =>
                  selectSection(
                    7,
                    "Are you sure want to publish this document?"
                  )
                }
              />
            )} */}

          {(currentDocRole?.reviewer ||
            currentDocRole?.approver ||
            currentDocRole?.primaryAuthor) && (
            <DefaultButton
              text="Preview Document"
              btnType="secondary"
              onClick={() =>
                togglePopupVisibility(
                  setPopupController,
                  0,
                  "open",
                  "Preview Document"
                )
              }
            />
          )}
          <DefaultButton
            text="Track"
            btnType="secondary"
            endIcon={<img src={locationIcon} alt="track" />}
            onClick={() => selectSection(1, "Document Tracker")}
          />
          {role === "Primary Author" || isAdmin ? (
            <DefaultButton
              text={
                <img
                  src={editConfigurationImg}
                  style={{
                    width: "20px",
                  }}
                  alt="editConfigurationImg"
                />
              }
              className={styles.editBtnConfig}
              btnType="secondary"
              onClick={async () => {
                dispatch(
                  setConfigurePageDetails({
                    pageKey: "update",
                  })
                );
                await getUniqueTaskData(
                  currentDocDetailsData?.taskID || PAtaskID,
                  dispatch
                );
                dispatch(
                  setConfigurePageDetails({
                    pageKey: "update",
                  })
                );
                // await getUniqueSectionsDetails(taskData?.documentDetailsId);

                // if (currentDocDetailsData?.documentVersion !== "1.0") {
                //   dispatch(
                //     setConfigurePageDetails({
                //       pageKey: "version update",
                //     })
                //   );
                // } else {
                //   dispatch(
                //     setConfigurePageDetails({
                //       pageKey: "update",
                //     })
                //   );
                // }

                if (isAdmin) {
                  navigate(`/admin/my_tasks/${documentName}/configure`);
                } else {
                  navigate(`/user/my_tasks/${documentName}/configure`);
                }
              }}
            />
          ) : (
            ""
          )}
          <DefaultButton
            text="View details"
            btnType="primary"
            onClick={() => selectSection(2, "Document Details")}
          />
        </div>
      </div>
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          // isLoading={AllSectionsData[activeSection]?.isLoading}
          PopupType={popupData.popupType}
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={
            popupData.popupType !== "custom" ? popupData.popupTitle : ""
          }
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </>
  );
};

export default Header;
