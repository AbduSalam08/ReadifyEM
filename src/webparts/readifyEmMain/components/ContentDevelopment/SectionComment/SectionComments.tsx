/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useState } from "react";
import styles from "./SectionComments.module.scss";
import CustomInput from "../../common/CustomInputFields/CustomInput";
const SendBtn = require("../../../../../assets/images/png/close.png");

interface Props {
  commentsData: any[];
  isHeader: boolean;
}

const SectionComments: React.FC<Props> = ({ commentsData, isHeader }) => {
  // initial States

  const [inputComment, setInputComment] = useState<string>("");

  const onChangeFunction = (value: string): any => {
    setInputComment(value);
  };

  return (
    <>
      <div className={styles.commentSecMain}>
        {isHeader && (
          <div className={styles.headerContainer}>
            <h3 style={{ color: "#666668", fontSize: "14px" }}>Comments</h3>
            <button className={styles.closeBtn}>
              <img src={SendBtn} alt={"back to my tasks"} />
            </button>
          </div>
        )}
        <div>
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
          <CustomInput
            value={inputComment}
            placeholder="Enter you comments here..."
            onChange={(value: string) => {
              onChangeFunction(value);
            }}
            submitBtn={true}
          />
        </div>
      </div>
    </>
  );
};

export default SectionComments;
