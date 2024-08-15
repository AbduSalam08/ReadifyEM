/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "primereact/dialog";
import DefaultButton from "../Buttons/DefaultButton";
// styles
import styles from "./Popup.module.scss";
import { CircularProgress } from "@mui/material";
import { memo } from "react";

interface Props {
  popupTitle?: string;
  PopupType: "custom" | "confirmation";
  popupActions: PopupActionBtn[]; // Ensure type safety for popup actions
  defaultCloseBtn?: boolean;
  content?: React.ReactNode;
  popupWidth?: string | number;
  onHide: () => void;
  visibility: boolean;
  confirmationTitle?: string;
  isLoading?: boolean;
  popupHeight?: boolean;
}

interface PopupActionBtn {
  text: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  btnType: any;
  onClick: any;
}

const Popup = ({
  PopupType,
  popupActions,
  popupTitle,
  defaultCloseBtn,
  onHide,
  visibility,
  content,
  popupWidth,
  confirmationTitle,
  isLoading,
  popupHeight,
  ...btnRest
}: Props): JSX.Element => {
  const headerElement = (
    <div
      className={`${
        !defaultCloseBtn
          ? styles.popupHeaderWithoutCloseIcon
          : styles.popupHeader
      }`}
    >
      {popupTitle}
    </div>
  );

  const footerContent = (): JSX.Element => (
    <div
      className={
        PopupType === "confirmation"
          ? styles.popupFooterConfirmation
          : styles.popupFooter
      }
    >
      {popupActions?.map((btn, id) => (
        <DefaultButton
          style={{
            minWidth: PopupType === "confirmation" ? "85px" : "auto",
          }}
          key={id}
          btnType={btn.btnType}
          text={btn.text}
          disabled={btn.disabled}
          endIcon={btn.endIcon}
          startIcon={btn.startIcon}
          onClick={btn.onClick}
          {...btnRest}
        />
      ))}
    </div>
  );

  const popupContent =
    PopupType === "confirmation" ? (
      <div className={styles.contentWrapper}>
        <div
          className={
            popupHeight
              ? styles.promoteContentContainer
              : styles.contentContainer
          }
        >
          <span className={styles.confirmTitleText}>{confirmationTitle}</span>
        </div>
        {footerContent()}
      </div>
    ) : PopupType === "custom" ? (
      <div className={styles.contentWrapper}>
        <div
          className={
            popupHeight
              ? styles.promoteContentContainer
              : styles.contentContainer
          }
        >
          {content}
        </div>
        {footerContent()}
      </div>
    ) : (
      "some thing is wrong with the properties!, please check."
    );

  return (
    <Dialog
      // closeIcon={defaultCloseBtn}
      closable={defaultCloseBtn}
      draggable={false}
      className={`popupWrapper ${styles.popupWrapper}`}
      visible={visibility}
      modal
      header={PopupType !== "confirmation" && headerElement}
      style={{ width: popupWidth }}
      onHide={onHide}
    >
      {isLoading ? (
        <div className={styles?.loaderElement}>
          <CircularProgress
            sx={{
              width: "40px",
              height: "40px",
              animationDuration: "450ms",
              color: "#555555ac",
            }}
            size={"30px"}
            disableShrink
            variant="indeterminate"
            color="inherit"
          />
        </div>
      ) : (
        popupContent
      )}
    </Dialog>
  );
};

export default memo(Popup);
