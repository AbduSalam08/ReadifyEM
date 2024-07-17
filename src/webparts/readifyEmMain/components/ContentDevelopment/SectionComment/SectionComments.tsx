/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from "react";
import styles from "./SectionComments.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
const closeBtn = require("../../../../../assets/images/png/close.png");
const sendBtn = require("../../../../../assets/images/png/Send.png");

interface Props {
  commentsData: any[];
  isHeader: boolean;
  noCommentInput?: boolean;
  viewOnly?: boolean;
}

const SectionComments: React.FC<Props> = ({
  commentsData,
  isHeader,
  noCommentInput,
  viewOnly,
}) => {
  // initial States

  const [inputComment, setInputComment] = useState<string>("");

  const onChangeFunction = (value: string): any => {
    setInputComment(value);
  };

  return (
    <>
      <div
        className={styles.commentSecMain}
        style={{
          backgroundColor: viewOnly ? "#D9D9D935" : "#fff",
          border: viewOnly ? "none" : "1px solid #ebeaec",
        }}
      >
        {isHeader && (
          <div className={styles.headerContainer}>
            <span className={styles.commentsTitle}>Comments</span>
            <button className={styles.closeBtn}>
              <img src={closeBtn} alt={"back to my tasks"} />
            </button>
          </div>
        )}
        <div>
          <div className={styles.commentsWrapper}>
            {commentsData?.map((item: any, index: number) => {
              return (
                <div className={styles.comments} key={index}>
                  <div className={styles.commentAuthor}>
                    <span>{item.commentAuthor.name}</span>
                    <span className={styles.role}>{item.role}</span>
                  </div>
                  <p>{item.comment}</p>
                  <span className={styles.date}>{item.commentDateAndTime}</span>
                </div>
              );
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
