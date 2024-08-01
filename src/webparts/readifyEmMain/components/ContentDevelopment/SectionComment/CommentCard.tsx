/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./SectionComments.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";
import dayjs from "dayjs";

interface ICommentCardProps {
  item: any;
  index: number;
}

const CommentCard = ({ item, index }: ICommentCardProps): JSX.Element => {
  console.log("item: ", item);
  console.log(item);
  return (
    <div className={styles.commentCardWrapper}>
      <div
        className={
          !item.isRejectedComment ? styles.comments : styles.rejectedComments
        }
        key={index}
      >
        <div className={styles.commentAuthor}>
          <span>{item.commentAuthor[0]?.name}</span>
          <span className={styles.role}>{item.role}</span>
        </div>
        <p>{item.comment}</p>
        <span className={styles.date}>
          {new Date(new Date()).getDate() !==
          new Date(item.commentDateAndTime).getDate()
            ? dayjs(item.commentDateAndTime).format("DD-MMM-YYYY hh:mm A")
            : dayjs(item.commentDateAndTime).format("hh:mm A")}
          <input
            type="text"
            autoFocus={true}
            readOnly={true}
            style={{
              height: 0,
              width: 0,
              opacity: 0,
            }}
          />
        </span>
      </div>
      <div className={styles.commentAuthorPersona}>
        <MultiplePeoplePersona data={[item?.commentAuthor]} />
      </div>
    </div>
  );
};

export default memo(CommentCard);
