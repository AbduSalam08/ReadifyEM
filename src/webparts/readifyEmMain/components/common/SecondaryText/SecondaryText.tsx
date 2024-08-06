/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./SecondaryText.module.scss";

interface SecondaryTextLabelProps {
  text: any;
  icon?: any;
  customClassWrapper?: string;
}

const SecondaryTextLabel = ({
  text,
  icon,
  customClassWrapper = "",
}: SecondaryTextLabelProps): JSX.Element => {
  return (
    <div className={`${styles.wrapper} ${customClassWrapper}`}>
      <p className={styles.emptyMsg}>
        {icon && icon}
        {text}
      </p>
    </div>
  );
};

export default SecondaryTextLabel;
