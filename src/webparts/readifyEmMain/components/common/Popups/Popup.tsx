/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "primereact/dialog";
import DefaultButton from "../Buttons/DefaultButton";
// styles
import styles from "./Popup.module.scss";

interface Props {
  popupTitle: string;
  PopupType: "custom" | "confirmation";
  popupActions: PopupActionBtn[]; // Ensure type safety for popup actions
  defaultCloseBtn?: boolean;
  content?: React.ReactNode;
  popupWidth?: string | number;
  onHide: () => void;
  visibility: boolean;
  confirmationTitle?: string;
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
    <div className={styles.popupFooter}>
      {popupActions?.map((btn, id) => (
        <DefaultButton
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
        <div className={styles.contentContainer}>{confirmationTitle}</div>
        {footerContent()}
      </div>
    ) : PopupType === "custom" ? (
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>{content}</div>
        {footerContent()}
      </div>
    ) : (
      "Need Content to be displayed in popup."
    );

  return (
    <Dialog
      // closeIcon={defaultCloseBtn}
      closable={defaultCloseBtn}
      draggable={false}
      className={`popupWrapper ${styles.popupWrapper}`}
      visible={visibility}
      modal
      header={headerElement}
      style={{ width: popupWidth }}
      onHide={onHide}
    >
      {popupContent}
    </Dialog>
  );
};

export default Popup;
