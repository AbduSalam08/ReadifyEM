/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from "react";
import styles from "./SectionComments.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import CommentCard from "./CommentCard";
import { ChevronRight } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
// const commentIcon = require("../../../../../assets/images/svg/violetCommentIcon.svg");
const sendBtn = require("../../../../../assets/images/png/Send.png");

import { addSectionComment } from "../../../../../services/ContentDevelopment/SectionComments/SectionComments";
import { initialPopupLoaders } from "../../../../../config/config";
import { IPopupLoaders } from "../../../../../interface/MainInterface";
import AlertPopup from "../../common/Popups/AlertPopup/AlertPopup";

interface Props {
  commentsData: any[];
  isHeader: boolean;
  noCommentInput?: boolean;
  viewOnly?: boolean;
  toggleCommentSection?: boolean;
  setToggleCommentSection?: any;
  documentId?: number;
  sectionId?: number;
  onClick?: any;
}

const SectionComments: React.FC<Props> = ({
  commentsData,
  isHeader,
  noCommentInput,
  viewOnly,
  toggleCommentSection,
  setToggleCommentSection,
  documentId,
  sectionId,
  onClick,
}) => {
  const dispatch = useDispatch();

  // popup loaders and messages
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // selectors
  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionCommentsData.SectionComments
  );
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );
  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );
  console.log(
    documentId,
    sectionId,
    AllSectionsComments,
    currentUserDetails,
    currentDocDetailsData
  );

  // initial States
  const [inputComment, setInputComment] = useState<string>("");

  const onChangeFunction = (value: string): any => {
    setInputComment(value);
  };

  const sendSectionComment = async () => {
    if (inputComment !== "") {
      console.log("clicked");
      let json = {
        comments: inputComment,
        sectionDetailsId: sectionId,
        createdById: currentUserDetails.id,
        role: currentDocDetailsData.taskRole,
      };
      let clearInput = await addSectionComment(
        json,
        AllSectionsComments,
        dispatch,
        currentUserDetails,
        setPopupLoaders
      );
      if (clearInput) {
        setInputComment("");
      }
    }
  };

  return (
    <>
      <div
        className={
          !toggleCommentSection
            ? styles.commentSecMain
            : styles.closedCommentSection
        }
        style={{
          backgroundColor: viewOnly ? "#93939335" : "#fff",
          border: viewOnly ? "none" : "1px solid #ebeaec",
          borderTopLeftRadius: toggleCommentSection ? "0" : "5px",
        }}
      >
        {isHeader && (
          <div className={styles.headerContainer}>
            {/* <button
              className={styles.commentsToggleBtn}
              onClick={() => {
                setToggleCommentSection(false);
              }}
            >
              <img src={commentIcon} alt={"comments"} />
            </button> */}
            <button
              className={styles.closeBtn}
              onClick={() => {
                setToggleCommentSection(true);
              }}
            >
              <ChevronRight />
            </button>
            <span className={styles.commentsTitle}>Comments</span>
          </div>
        )}
        <div className={styles.commentBoxWrapper}>
          <div className={styles.commentsWrapper}>
            {AllSectionsComments?.map((item: any, index: number) => {
              return <CommentCard index={index} item={item} key={index} />;
            })}
          </div>
          {!noCommentInput && (
            <div className={styles.commentsBar}>
              <CustomInput
                value={inputComment}
                placeholder="Enter you comments here..."
                onChange={(value: string) => {
                  onChangeFunction(value);
                }}
                noBorderInput={true}
                inputWrapperClassName={styles.commentBoxInput}
                // submitBtn={true}
              />
              <button
                className={styles.sendBtn}
                onClick={() => sendSectionComment()}
              >
                <img src={sendBtn} />
              </button>
            </div>
          )}
        </div>
      </div>
      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
          // setMainData();
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />
    </>
  );
};

export default SectionComments;
