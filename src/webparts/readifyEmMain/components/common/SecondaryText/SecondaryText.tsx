/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./SecondaryText.module.scss";

interface SecondaryTextLabelProps {
  text: any;
  icon?: any;
  customClassWrapper?: string;
  externalStyles?: any;
}

const SecondaryTextLabel = ({
  text,
  icon,
  customClassWrapper = "",
  externalStyles,
}: SecondaryTextLabelProps): JSX.Element => {
  return (
    <div className={`${styles.wrapper} ${customClassWrapper}`}>
      <p className={styles.emptyMsg} style={externalStyles}>
        {icon && icon}
        {text}
      </p>
    </div>
  );
};

export default SecondaryTextLabel;
