/* eslint-disable no-unused-expressions */
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
  onChange?: (value: any[]) => void;
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
  hideErrMsg?: boolean;
  noErrorMsg?: boolean; // if true, no error message will be shown
  noBorderInput?: boolean;
  maxWidth?: any;
  minHeight?: any;
  maxHeight?: any;
  noRemoveBtn?: boolean;
  multiUsers?: boolean;
  mandatory?: boolean;
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
  noBorderInput,
  maxWidth,
  noRemoveBtn,
  minHeight,
  maxHeight,
  mandatory,
  multiUsers = false,
}) => {
  const multiPeoplePickerStyle = {
    root: {
      minWidth: minWidth ? minWidth : "100%",
      maxWidth: maxWidth ? maxWidth : "100%",
      background: "rgba(218, 218, 218, 0.29)",
      ".ms-BasePicker-text": {
        // alignItems: "flex-start",
        // maxHeight: "50px",
        height: size === "SM" ? "34px" : size === "MD" ? "32px" : "43px",
        borderRadius: "4px",
        overflowX: "hidden",
        padding: "0px 4px",
        minHeight: minHeight ? minHeight : "34px",
        maxHeight: maxHeight ? maxHeight : "50px",
        minWidth: minWidth ? minWidth : "290px",
        background: "#fff",
        border: isValid
          ? "1px solid #ff8585"
          : noBorderInput
          ? "none"
          : "1px solid #adadad50",
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
        border:
          !noBorderInput && isValid
            ? "1px solid #ff8585"
            : !noBorderInput
            ? "1px solid #adadad50"
            : "none",
      },
      ".ms-TooltipHost": {
        fontFamily: "interMedium",
        fontSize: "13px",
        color: "#414141",
      },
      ".ms-PickerPersona-container": {
        background: "#e8e8e8",
        maxWidth: "auto",
        minWidth: "auto",
      },
      ".ms-PickerItem-removeButton": {
        display: noRemoveBtn ? "none" : "block",
      },
      ".ms-PickerItem-removeButton:focus": {
        background: "#555",
      },
      ".ms-BasePicker-itemsWrapper": {
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        flexWrap: "nowrap",
        gap: "2px",
        overflow: "auto",
        // padding: "3px 0",
      },
    },
  };

  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );

  const handleChange = (items: any[]): void => {
    console.log("items: ", items);
    const obj = items?.map((item: any) => {
      return {
        id: item.id,
        email: item?.secondaryText,
        name: item?.text,
      };
    });
    onChange && onChange(obj);
  };

  const selectedUserItem = (() => {
    if (!multiUsers) {
      return personSelectionLimit > 1 ? [] : [selectedItem];
    } else {
      if (personSelectionLimit >= 1) {
        return (
          selectedItem?.map(
            (item: any) => item.secondaryText || item.Email || item.email
          ) || []
        );
      }
    }

    return [selectedItem];
  })();

  return (
    <div className={styles.inputMainWrapper}>
      <div
        className={`${
          withLabel
            ? styles.p_pickerInputWrapperWithLabel
            : styles.p_pickerInputWrapper
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
        <PeoplePicker
          context={mainContext}
          webAbsoluteUrl={CONFIG.webURL}
          //   titleText="Select People"
          personSelectionLimit={personSelectionLimit}
          showtooltip={false}
          ensureUser={true}
          placeholder={placeholder}
          // peoplePickerCntrlclassName={styles.}
          onChange={handleChange}
          styles={multiPeoplePickerStyle}
          //   showHiddenInUI={true}
          principalTypes={[PrincipalType.User]}
          defaultSelectedUsers={selectedUserItem}
          resolveDelay={1000}
          disabled={readOnly}
        />
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
    </div>
  );
};

export default memo(CustomPeoplePicker);
