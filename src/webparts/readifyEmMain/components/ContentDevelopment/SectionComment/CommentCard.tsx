/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./SectionComments.module.scss";
import MultiplePeoplePersona from "../../common/CustomInputFields/MultiplePeoplePersona";

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
        <span className={styles.date}>{item.commentDateAndTime}</span>
      </div>
      <div className={styles.commentAuthorPersona}>
        <MultiplePeoplePersona data={[item?.commentAuthor]} />
      </div>
    </div>
  );
};

export default memo(CommentCard);
