/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonProps } from "@mui/material";
import styles from "./Buttons.module.scss";

interface Props extends ButtonProps {
  text: string;
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
    | "secondaryRed"
    | "primaryBlue"
    | "secondaryBlue";
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
  };

  // Dynamically select the CSS class based on btnType
  const buttonClass = `${styles.DefaultButtonWrapper} ${btnTypeClassMap[btnType]}`;

  return (
    <Button
      className={`${disabled && styles.disabled} ${buttonClass}`}
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
