/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./Header.module.scss";
import DefaultButton from "../../common/Buttons/DefaultButton";
import StatusPill from "../../StatusPill/StatusPill";
import { useNavigate } from "react-router-dom";
import { getUniqueTaskData } from "../../../../../services/MyTasks/MyTasksServices";
import { setConfigurePageDetails } from "../../../../../redux/features/SectionConfigurationSlice";
import { useDispatch } from "react-redux";
import { CurrentUserIsAdmin } from "../../../../../constants/DefineUser";
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
}

const Header: React.FC<Props> = ({
  documentName,
  role,
  documentStatus,
  onChange,
  currentDocDetailsData,
}) => {
  // route navigator
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdmin = CurrentUserIsAdmin();

  const selectSection = (index: number, title: string): any => {
    onChange(index, false, title);
  };
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
              {documentName}
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
          {/* <DefaultButton
            text="Promote"
            btnType="secondary"
            endIcon={<img src={locationIcon} alt="track" />}
            onClick={() => selectSection(1, "Document Tracker")}
          /> */}
          <DefaultButton
            text="Track"
            btnType="secondary"
            endIcon={<img src={locationIcon} alt="track" />}
            onClick={() => selectSection(1, "Document Tracker")}
          />
          {role === "Primary Author" ? (
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
                await getUniqueTaskData(
                  currentDocDetailsData?.taskID,
                  dispatch
                );
                // await getUniqueSectionsDetails(taskData?.documentDetailsId);
                dispatch(
                  setConfigurePageDetails({
                    pageKey: "update",
                  })
                );

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
    </>
  );
};

export default Header;
