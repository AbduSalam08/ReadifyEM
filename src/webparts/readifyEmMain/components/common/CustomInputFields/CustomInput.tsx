/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import { memo, useCallback } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
const SendBtn = require("../../../../../assets/images/png/Send.png");
import styles from "./Inputs.module.scss";

interface Props {
  value: string | number | any;
  onChange: (value: string | any) => void;
  type?: "text" | "number";
  placeholder?: string;
  icon?: unknown;
  size?: "SM" | "MD" | "XL";
  isValid?: any;
  errorMsg?: string;
  withLabel?: boolean;
  labelText?: string;
  disabled?: boolean;
  inputClassName?: any;
  inputWrapperClassName?: any;
  readOnly?: any;
  mandatory?: boolean;
  hideErrMsg?: boolean;
  submitBtn?: boolean;
  onKeyDown?: any;
  noErrorMsg?: boolean;
  autoFocus?: boolean;
}

const CustomInput: React.FC<Props> = ({
  value,
  onChange,
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
  onKeyDown,
  noErrorMsg = false,
  autoFocus,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // const newValue =
      // type === "number" ? parseFloat(e.target.value) : e.target.value;
      onChange(e.target.value);
    },
    [onChange, type]
  );
  // const MainSPContext = useSelector((state: any) => state.MainSPContext.value);

  return (
    <>
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        } ${disabled ? styles.disabledInput : ""}`}
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
            readOnly ? styles.readOnly : ""
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
            // v-model="value1"
            readOnly={readOnly}
            autoFocus={autoFocus}
            disabled={disabled}
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            className={inputClassName}
            onKeyDown={onKeyDown}
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
        </IconField>
      </div>

      {isValid && !noErrorMsg && (
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
      )}
    </>
  );
};

export default memo(CustomInput);
