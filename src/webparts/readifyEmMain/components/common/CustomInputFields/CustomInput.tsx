/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
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
        {withLabel && <p className={styles.inputLabel}>{labelText}</p>}
        <IconField
          disabled={disabled}
          iconPosition="left"
          className={`${inputWrapperClassName} ${
            styles[`customInput${size}`]
          } ${isValid ? styles.errorInput : ""}`}
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
        </IconField>
      </div>

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
    </>
  );
};

export default memo(CustomInput);
