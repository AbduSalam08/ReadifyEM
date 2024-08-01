/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useCallback } from "react";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
import { InputTextarea } from "primereact/inputtextarea";
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
  mandatory?: boolean;
  inputClassName?: any;
  inputWrapperClassName?: any;
  readOnly?: any;
  noBorderInput?: boolean;
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
  inputClassName,
  inputWrapperClassName,
  readOnly,
  mandatory,
  noBorderInput,
}) => {
  const handleChange = (e: any): any => {
    onChange(e.target.value);
  };
  // useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const newValue =
  //       type === "number" ? parseFloat(e.target.value) : e.target.value;
  //     onChange(newValue);
  // },
  // [onChange, type]
  // );
  // const MainSPContext = useSelector((state: any) => state.MainSPContext.value);

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
        }}
      >
        {withLabel && (
          <p
            className={`${styles.inputLabel} ${
              mandatory ? styles.mandatoryField : ""
            }`}
            style={{ width: "50%" }}
          >
            {labelText}
          </p>
        )}
        {/* <IconField
          disabled={disabled}
          iconPosition="left"
          className={`${inputWrapperClassName} ${
            styles[`customInput${size}`]
          } ${isValid ? styles.errorInput : ""}`}
        > */}
        {/* {icon && (
            <InputIcon
              style={{
                color: "var(--placeholder)",
              }}
              className={`pi pi-search`}
            />
          )} */}
        <InputTextarea
          v-model="value1"
          readOnly={readOnly}
          disabled={disabled}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => handleChange(e)}
          className={inputClassName}
          rows={5}
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
            padding: "5px 10px",
            width: "100%",
            fontSize: "14px",
            fontFamily: `interMedium, sans-serif`,
          }}
        />
        {/* </IconField> */}
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
