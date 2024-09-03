/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useCallback } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
const SendBtn = require("../../../../../assets/images/png/Send.png");
const ClearBtn = require("../../../../../assets/images/png/close.png");
import styles from "./Inputs.module.scss";

interface Props {
  value: string | number | any;
  onChange?: (value: string | any) => void;
  onClickFunction?: (value: boolean) => void;
  type?: "text" | "number";
  placeholder?: string;
  icon?: unknown;
  size?: "SM" | "MD" | "XL";
  isValid?: any;
  errorMsg?: string;
  secWidth?: string;
  withLabel?: boolean;
  labelText?: string;
  disabled?: boolean;
  inputClassName?: any;
  inputWrapperClassName?: any;
  readOnly?: any;
  mandatory?: boolean;
  hideErrMsg?: boolean;
  submitBtn?: boolean;
  clearBtn?: boolean;
  autoFocus?: boolean;
  noErrorMsg?: boolean;
  onKeyDown?: any;
  noBorderInput?: boolean;
  topLabel?: boolean;
}

const CustomInput: React.FC<Props> = ({
  value,
  onChange,
  onClickFunction,
  type = "text",
  placeholder = "",
  size = "MD",
  icon,
  isValid,
  errorMsg,
  labelText,
  withLabel,
  disabled,
  inputClassName,
  inputWrapperClassName,
  readOnly,
  mandatory,
  hideErrMsg,
  submitBtn,
  clearBtn,
  autoFocus,
  noErrorMsg,
  onKeyDown,
  noBorderInput,
  topLabel,
  secWidth = "100%",
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue =
        type === "number" ? parseFloat(e.target.value) : e.target.value;
      onChange && onChange(newValue);
    },
    [onChange, type]
  );
  // const MainSPContext = useSelector((state: any) => state.MainSPContext.value);

  return (
    <div
      // className={styles.inputMainWrapper}
      className={`${styles.inputMainWrapper} ${
        topLabel ? styles.topinputMainWrapper : ""
      }`}
      style={{
        width: secWidth ? secWidth : "auto",
      }}
    >
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        } ${disabled ? styles.disabledInput : ""} ${
          topLabel ? styles.topLabel : ""
        } `}
      >
        {withLabel && (
          <p
            className={`${styles.inputLabel} ${
              mandatory ? styles.mandatoryField : ""
            }`}
          >
            {labelText}
          </p>
        )}
        <IconField
          disabled={disabled}
          iconPosition="left"
          className={`${inputWrapperClassName} ${
            styles[`customInput${size}`]
          } ${isValid ? styles.errorInput : ""} ${
            noBorderInput ? styles.noBorderInput : ""
          }`}
        >
          {icon && (
            <InputIcon
              style={{
                color: "var(--placeholder)",
              }}
              className={`pi pi-search`}
            />
          )}
          <InputText
            v-model="value1"
            readOnly={readOnly}
            autoFocus={autoFocus}
            disabled={disabled}
            onKeyDown={onKeyDown}
            value={value || ""}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            onClick={() => {
              onClickFunction && onClickFunction(true);
            }}
            className={inputClassName}
            style={{
              paddingLeft: icon ? "30px" : "0px",
            }}
          />
          {submitBtn && (
            <button
              className={styles.sendBtn}
              // onClick={() => {
              //   navigate(-1);
              // }}
            >
              <img src={SendBtn} alt={"back to my tasks"} />
            </button>
          )}
          {clearBtn && (
            <button
              className={styles.sendBtn}
              // onClick={() => {
              //   navigate(-1);
              // }}
            >
              <img src={ClearBtn} alt={"back to my tasks"} />
            </button>
          )}
        </IconField>
      </div>

      {/* {isValid ? (
        <p
          className={`${styles.errorMsg}${hideErrMsg ? styles.hideErrMSg : ""}`}
          style={{
            textAlign: isValid && !withLabel ? "left" : "right",
          }}
        >
          {errorMsg}
        </p>
      ) : (
        <p
          className={`${styles.errorMsg}${hideErrMsg ? styles.hideErrMSg : ""}`}
          style={{
            textAlign: isValid && !withLabel ? "left" : "right",
          }}
        >
          {""}
        </p>
      )} */}

      {isValid && !noErrorMsg && (
        <p
          className={styles.errorMsg}
          style={{
            textAlign: isValid && !withLabel ? "left" : "right",
          }}
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default CustomInput;
