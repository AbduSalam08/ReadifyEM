/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useRef, memo } from "react";
import { Toast } from "primereact/toast";
const SuccessImg = require("../../../../../assets/images/png/completedIcon.png");
import "./ToastMessage.css";

interface Iprops {
  message: string;
  severity: string;
  duration: number;
  title: string;
  isShow: boolean;
  setToastMessage: any;
}

const ToastMessage = ({
  message,
  severity,
  duration,
  title,
  isShow,
  setToastMessage,
}: Iprops): JSX.Element => {
  const toast: any = useRef(null);

  const clear = () => {
    toast.current.clear();
  };

  const show = () => {
    // toast.current.clear();
    toast.current.show({
      severity: severity,
      summary: title,
      // detail: message,
      content: (
        <div
          className="flex flex-column align-items-left "
          style={{ display: "flex", flex: "1" }}
        >
          <div className="p-toast-image" style={{ marginRight: "15px" }}>
            <img style={{ width: "30px", height: "30px" }} src={SuccessImg} />
          </div>
          <div>
            <span className="p-toast-summary">{title}</span>
            <div className="p-toast-detail">{message}</div>
          </div>
        </div>
      ),
      life: duration,
    });
    setToastMessage({
      isShow: false,
      severity: "",
      title: "",
      message: "",
      duration: 3000,
    });
  };

  useEffect(() => {
    if (isShow) {
      show();
    }
    console.log("show");
  });

  return (
    <div>
      <Toast
        className={
          severity === "success"
            ? "toastMainWrapperSuccess"
            : severity === "info"
            ? "toastMainWrapperInfo"
            : severity === "warn"
            ? "toastMainWrapperWarn"
            : "toastMainWrapperError"
        }
        // className="toastMainWrapper"
        ref={toast}
        onRemove={clear}
      />
    </div>
  );
};

export default memo(ToastMessage);
