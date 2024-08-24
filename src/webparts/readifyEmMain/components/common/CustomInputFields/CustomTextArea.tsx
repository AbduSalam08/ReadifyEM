/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useCallback } from "react";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
import { InputTextarea } from "primereact/inputtextarea";
import styles from "./Inputs.module.scss";

interface Props {
  value: string | number | any;
  rows?: number;
  onChange: (value: string | any) => void;
  type?: "text" | "number";
  placeholder?: string;
  icon?: unknown;
  size?: "SM" | "MD" | "XL";
  isValid?: any;
  errorMsg?: string;
  withLabel?: boolean;
  topLabel?: boolean;
  labelText?: string;
  disabled?: boolean;
  mandatory?: boolean;
  inputClassName?: any;
  inputWrapperClassName?: any;
  readOnly?: any;
  textAreaWidth?: any;
  noBorderInput?: boolean;
  onKeyDown?: any;
}

const CustomTextArea: React.FC<Props> = ({
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
  onKeyDown,
  inputClassName,
  inputWrapperClassName,
  readOnly,
  mandatory,
  noBorderInput,
  textAreaWidth,
  rows,
  topLabel,
}) => {
  const handleChange = (e: any): any => {
    onChange(e.target.value);
  };
  return (
    <div className={styles.inputMainWrapper}>
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        } ${disabled ? styles.disabledInput : ""}`}
        style={{
          display: "flex",
          width: "100%",
          gap: 0,
          alignItems: "flex-start",
          flexWrap: topLabel ? "wrap" : "nowrap",
        }}
      >
        {withLabel && (
          <p
            className={`${styles.inputLabel} ${
              mandatory ? styles.mandatoryField : ""
            }`}
            style={{ width: "50%", marginBottom: topLabel ? "10px" : "0px" }}
          >
            {labelText}
          </p>
        )}

        <InputTextarea
          v-model="value1"
          readOnly={readOnly}
          disabled={disabled}
          onKeyDown={onKeyDown}
          autoResize
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => handleChange(e)}
          className={inputClassName}
          rows={rows ? rows : 5}
          cols={30}
          style={{
            // paddingLeft: icon ? "30px" : "0px",
            border: `${
              isValid
                ? "1px solid #ff8585"
                : noBorderInput
                ? "none"
                : `1px solid #e5e5e5`
            }`,
            padding: inputWrapperClassName ? "" : "5px 10px",
            margin: inputWrapperClassName ? "10px" : "",
            width: textAreaWidth ? textAreaWidth : "100%",
            minHeight: inputWrapperClassName ? "20px" : "100px",
            maxHeight: inputWrapperClassName ? "100px" : "100px",
            height: value !== "" ? "20px" : "auto",
            fontSize: "14px",
            fontFamily: `interMedium, sans-serif`,
          }}
        />
      </div>

      {isValid && (
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

export default CustomTextArea;
