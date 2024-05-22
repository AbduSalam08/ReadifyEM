/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/self-closing-comp */
import { TreeSelect } from "primereact/treeselect";
import styles from "./Inputs.module.scss";

interface Props {
  value: string | number | any;
  onChange: (value: string | any) => void;
  placeholder?: string;
  options: any;
  isValid?: any;
  errorMsg?: string;
  withLabel?: boolean;
  labelText?: string;
  size?: "SM" | "MD" | "XL";
  customWrapperClass?: any;
}
const CustomTreeDropDown: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "",
  options,
  isValid,
  errorMsg,
  withLabel,
  labelText,
  customWrapperClass,
  size = "MD",
}): JSX.Element => {
  return (
    <>
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        }`}
      >
        {withLabel && <p className={styles.inputLabel}>{labelText}</p>}
        <TreeSelect
          style={{
            padding: "0 10px",
          }}
          value={value}
          onChange={(e: any) => {
            onChange(e.value);
          }}
          options={options}
          metaKeySelection={false}
          className={`${styles.treeSelect} customTreeSelect w-full ${
            styles[`customInput${size}`]
          } ${isValid ? styles.errorInput : ""}`}
          // selectionMode="multiple"
          // selectionMode="single"
          placeholder={placeholder}
          filter
          filterPlaceholder="search path"
          // display="chip"
          // showClear={true}
          filterBy="label,value"
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
    </>
  );
};
export default CustomTreeDropDown;
