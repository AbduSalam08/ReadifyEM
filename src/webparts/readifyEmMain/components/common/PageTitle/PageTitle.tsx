import { memo } from "react";
import styles from "./PageTitle.module.scss";
interface Props {
  text: string;
}
const PageTitle: React.FC<Props> = ({ text }): JSX.Element => {
  return <h1 className={styles.pageTitle}>{text}</h1>;
};

export default memo(PageTitle);
