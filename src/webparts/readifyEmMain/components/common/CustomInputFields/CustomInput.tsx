/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
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
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue =
        type === "number" ? parseFloat(e.target.value) : e.target.value;
      onChange(newValue);
    },
    [onChange, type]
  );
  // const MainSPContext = useSelector((state: any) => state.MainSPContext.value);

  return (
    <>
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        }`}
      >
        {withLabel && <p className={styles.inputLabel}>{labelText}</p>}
        <IconField
          iconPosition="left"
          className={`${styles[`customInput${size}`]} ${
            isValid ? styles.errorInput : ""
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
            value={value || ""}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            style={{
              paddingLeft: icon ? "30px" : "0px",
            }}
          />
        </IconField>
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
    </>
  );
};

export default CustomInput;
