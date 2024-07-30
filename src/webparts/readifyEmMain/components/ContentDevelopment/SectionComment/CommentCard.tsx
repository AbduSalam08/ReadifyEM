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
  return (
    <div className={styles.commentCardWrapper}>
      <div className={styles.comments} key={index}>
        <div className={styles.commentAuthor}>
          <span>{item.commentAuthor[0].name}</span>
          <span className={styles.role}>{item.role}</span>
        </div>
        <p>{item.comment}</p>
        <span className={styles.date}>
          {new Date(new Date()).getDate() !==
          new Date(item.commentDateAndTime).getDate()
            ? dayjs(item.commentDateAndTime).format("DD-MMM-YYYY hh:mm A")
            : dayjs(item.commentDateAndTime).format("hh:mm A")}
        </span>
      </div>
      <div className={styles.commentAuthorPersona}>
        <MultiplePeoplePersona data={[item?.commentAuthor]} />
      </div>
    </div>
  );
};

export default memo(CommentCard);
