/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from "react";
import styles from "./SectionComments.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
import CommentCard from "./CommentCard";
import { ChevronRight } from "@mui/icons-material";
// const commentIcon = require("../../../../../assets/images/svg/violetCommentIcon.svg");
const sendBtn = require("../../../../../assets/images/png/Send.png");

interface Props {
  commentsData: any[];
  isHeader: boolean;
  noCommentInput?: boolean;
  viewOnly?: boolean;
  toggleCommentSection?: boolean;
  setToggleCommentSection?: any;
}

const SectionComments: React.FC<Props> = ({
  commentsData,
  isHeader,
  noCommentInput,
  viewOnly,
  toggleCommentSection,
  setToggleCommentSection,
}) => {
  // initial States
  const [inputComment, setInputComment] = useState<string>("");

  const onChangeFunction = (value: string): any => {
    setInputComment(value);
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
            {commentsData?.map((item: any, index: number) => {
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
              <button className={styles.sendBtn}>
                <img src={sendBtn} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionComments;
