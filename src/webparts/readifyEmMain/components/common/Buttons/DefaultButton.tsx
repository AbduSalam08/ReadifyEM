/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps } from "@mui/material";
import styles from "./Buttons.module.scss";

interface Props extends ButtonProps {
  text: any;
  endIcon?: any;
  startIcon?: any;
  disabled?: boolean;
  btnType:
    | "primary"
    | "secondary"
    | "lightGreyVariant"
    | "darkGreyVariant"
    | "greyOutlined"
    | "primaryGreen"
    | "primaryDarkGreen"
    | "secondaryRed"
    | "primaryBlue"
    | "secondaryBlue"
    | "primaryRed"
    | "actionBtn";
}

const DefaultButton = ({
  text,
  btnType,
  endIcon,
  startIcon,
  disabled,
  ...rest
}: Props): JSX.Element => {
  // Define a mapping object for btnType to CSS classes
  const btnTypeClassMap: Record<Props["btnType"], string> = {
    primary: styles.primary,
    secondary: styles.secondary,
    lightGreyVariant: styles.lightGreyVariant,
    darkGreyVariant: styles.darkGreyVariant,
    greyOutlined: styles.greyOutlined,
    primaryGreen: styles.primaryGreen,
    secondaryRed: styles.secondaryRed,
    primaryBlue: styles.primaryBlue,
    secondaryBlue: styles.secondaryBlue,
    primaryDarkGreen: styles.primaryDarkGreen,
    primaryRed: styles.primaryRed,
    actionBtn: styles.actionBtn,
  };

  // Dynamically select the CSS class based on btnType
  const buttonClass = `${styles.DefaultButtonWrapper} ${btnTypeClassMap[btnType]}`;

  return (
    <Button
      className={`${disabled && styles.disabledBtn} ${buttonClass}`}
      variant="outlined"
      {...rest}
      endIcon={endIcon}
      startIcon={startIcon}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

export default DefaultButton;
