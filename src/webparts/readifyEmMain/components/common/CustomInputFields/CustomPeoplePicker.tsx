/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import styles from "./Inputs.module.scss";
import { useSelector } from "react-redux";
import { CONFIG } from "../../../../../config/config";

interface Props {
  selectedItem?: any;
  onChange: (value: string) => void;
  placeholder?: string;
  personSelectionLimit?: number;
  size?: "SM" | "MD" | "XL";
  isValid?: boolean;
  errorMsg?: string;
  labelText?: string;
  withLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  minWidth?: any;
}

const CustomPeoplePicker: React.FC<Props> = ({
  onChange,
  placeholder = "User",
  personSelectionLimit,
  selectedItem,
  size,
  withLabel,
  labelText,
  disabled,
  isValid,
  errorMsg,
  minWidth,
  readOnly,
}) => {
  const multiPeoplePickerStyle = {
    root: {
      minWidth: minWidth ? minWidth : 200,
      background: "rgba(218, 218, 218, 0.29)",
      ".ms-BasePicker-text": {
        // minHeigth: "43px",
        height: size === "SM" ? "34px" : size === "MD" ? "32px" : "43px",
        borderRadius: "4px",
        maxHeight: "50px",
        overflowX: "hidden",
        padding: "0px 10px",
        minWidth: minWidth ? minWidth : "290px",
        background: "#fff",
        border: isValid ? "1px solid #ff8585" : "1px solid #adadad50",
        outline: "none",
        fontFamily: "interMedium",
      },
      ".ms-BasePicker-input": {
        height: size === "SM" ? "30px" : size === "MD" ? "30px" : "41px",
        fontFamily: "interMedium",
      },
      ".ms-BasePicker-input::placeholder": {
        fontFamily: "interMedium",
      },
      ".ms-BasePicker-text:after": {
        display: "none",
      },
      ".ms-BasePicker-text:hover": {
        border: isValid ? "1px solid #ff8585" : "1px solid #adadad50",
      },
      ".ms-TooltipHost": {
        fontFamily: "interMedium",
        fontSize: "13px",
        color: "#414141",
      },
      ".ms-PickerPersona-container": {
        background: "#e8e8e8",
      },
      ".ms-PickerItem-removeButton:focus": {
        background: "#555",
      },
    },
  };

  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );

  const handleChange = (e: any): void => {
    onChange(e);
  };

  return (
    <>
      {/* <PeoplePicker
        context={mainContext}
        webAbsoluteUrl={CONFIG.webURL}
        //   titleText="Select People"
        personSelectionLimit={personSelectionLimit}
        showtooltip={false}
        ensureUser={true}
        placeholder={placeholder}
        // peoplePickerCntrlclassName={styles.}
        onChange={(e: any) => {
          handleChange(e);
        }}
        styles={multiPeoplePickerStyle}
        //   showHiddenInUI={true}
        principalTypes={[PrincipalType.User]}
        defaultSelectedUsers={[selectedItem] || null}
        resolveDelay={1000}
      />
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p> */}

      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        } ${disabled ? styles.disabledInput : ""}`}
      >
        {withLabel && <p className={styles.inputLabel}>{labelText}</p>}
        {/* <IconField
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
            v-model="value1"
            readOnly={readOnly}
            disabled={disabled}
            value={value || ""}
            type={type}
            placeholder={placeholder}
            onChange={handleChange}
            className={inputClassName}
            style={{
              paddingLeft: icon ? "30px" : "0px",
            }}
          />
        </IconField> */}
        <PeoplePicker
          context={mainContext}
          webAbsoluteUrl={CONFIG.webURL}
          //   titleText="Select People"
          personSelectionLimit={personSelectionLimit}
          showtooltip={false}
          ensureUser={true}
          placeholder={placeholder}
          // peoplePickerCntrlclassName={styles.}
          onChange={(e: any) => {
            handleChange(e);
          }}
          styles={multiPeoplePickerStyle}
          //   showHiddenInUI={true}
          principalTypes={[PrincipalType.User]}
          defaultSelectedUsers={[selectedItem] || null}
          resolveDelay={1000}
          disabled={readOnly}
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

export default memo(CustomPeoplePicker);
