// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { memo } from "react";
// import {
//   PeoplePicker,
//   PrincipalType,
// } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import styles from "./Inputs.module.scss";
// import { useSelector } from "react-redux";
// import { CONFIG } from "../../../../../config/config";

// interface Props {
//   selectedItem?: any;
//   onChange: (value: any[]) => void;
//   placeholder?: string;
//   personSelectionLimit?: number | any;
//   size?: "SM" | "MD" | "XL";
//   isValid: boolean;
//   errorMsg?: string;
//   minWidth?: any;
//   noErrorMsg?: boolean; // if true, no error message will be shown
// }

// const CustomPeoplePicker: React.FC<Props> = ({
//   onChange,
//   placeholder = "User",
//   personSelectionLimit,
//   selectedItem,
//   size,
//   isValid,
//   errorMsg,
//   minWidth,
//   noErrorMsg = false,
// }) => {
//   const multiPeoplePickerStyle = {
//     root: {
//       minWidth: minWidth ? minWidth : 200,
//       background: "rgba(218, 218, 218, 0.29)",
//       ".ms-BasePicker-text": {
//         height: size === "SM" ? "34px" : size === "MD" ? "32px" : "43px",
//         borderRadius: "4px",
//         maxHeight: "50px",
//         overflowX: "hidden",
//         padding: "0px 10px",
//         minWidth: minWidth ? minWidth : "290px",
//         background: "#fff",
//         border: isValid ? "1px solid #ff8585" : "1px solid #adadad50",
//         outline: "none",
//         fontFamily: "interMedium",
//       },
//       ".ms-BasePicker-input": {
//         height: size === "SM" ? "30px" : size === "MD" ? "30px" : "41px",
//         fontFamily: "interMedium",
//       },
//       ".ms-BasePicker-input::placeholder": {
//         fontFamily: "interMedium",
//       },
//       ".ms-BasePicker-text:after": {
//         display: "none",
//       },
//       ".ms-BasePicker-text:hover": {
//         border: isValid ? "1px solid #ff8585" : "1px solid #adadad50",
//       },
//       ".ms-TooltipHost": {
//         fontFamily: "interMedium",
//         fontSize: "13px",
//         color: "#414141",
//       },
//       ".ms-PickerPersona-container": {
//         background: "#e8e8e8",
//       },
//       ".ms-PickerItem-removeButton:focus": {
//         background: "#555",
//       },
//     },
//   };

//   const mainContext: any = useSelector(
//     (state: any) => state.MainSPContext.value
//   );

//   const handleChange = (items: any[]): void => {
//     onChange(items);
//   };

//   const selectedUserItem =
//     personSelectionLimit > 1
//       ? selectedItem?.map((item: any) => item.secondaryText || item.Email)
//       : [selectedItem];

//   return (
//     <>
//       <PeoplePicker
//         context={mainContext}
//         webAbsoluteUrl={CONFIG.webURL}
//         personSelectionLimit={personSelectionLimit || 1}
//         showtooltip={false}
//         ensureUser={true}
//         placeholder={placeholder}
//         onChange={handleChange}
//         styles={multiPeoplePickerStyle}
//         principalTypes={[PrincipalType.User]}
//         defaultSelectedUsers={selectedUserItem}
//         resolveDelay={1000}
//       />
//       {!noErrorMsg && (
//         <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
//       )}
//     </>
//   );
// };

// export default memo(CustomPeoplePicker);

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
  onChange: (value: any[]) => void;
  placeholder?: string;
  personSelectionLimit?: number | any;
  size?: "SM" | "MD" | "XL";
  isValid?: boolean;
  errorMsg?: string;
  labelText?: string;
  withLabel?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  minWidth?: any;
  noErrorMsg?: boolean; // if true, no error message will be shown
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
  noErrorMsg = false,
  readOnly,
}) => {
  const multiPeoplePickerStyle = {
    root: {
      minWidth: minWidth ? minWidth : 200,
      background: "rgba(218, 218, 218, 0.29)",
      ".ms-BasePicker-text": {
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

  const handleChange = (items: any[]): void => {
    onChange(items);
  };

  const selectedUserItem =
    personSelectionLimit > 1
      ? selectedItem?.map((item: any) => item.secondaryText || item.Email)
      : [selectedItem];

  return (
    <>
      <div
        className={`${
          withLabel ? styles.inputWrapperWithLabel : styles.inputWrapper
        } ${disabled ? styles.disabledInput : ""}`}
      >
        {withLabel && <p className={styles.inputLabel}>{labelText}</p>}
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
          defaultSelectedUsers={[selectedUserItem] || null}
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
