/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
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
  isValid: boolean;
  errorMsg: string;
}

const CustomPeoplePicker: React.FC<Props> = ({
  onChange,
  placeholder = "User",
  personSelectionLimit,
  selectedItem,
  size,
  isValid,
  errorMsg,
}) => {
  const multiPeoplePickerStyle = {
    root: {
      minWidth: 200,
      background: "rgba(218, 218, 218, 0.29)",
      ".ms-BasePicker-text": {
        // minHeigth: "43px",
        height: size === "SM" ? "34px" : size === "MD" ? "32px" : "43px",
        borderRadius: "4px",
        maxHeight: "50px",
        overflowX: "hidden",
        padding: "0px 10px",
        minWidth: "290px",
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

  console.log("selectedItem: ", selectedItem);

  const mainContext: any = useSelector(
    (state: any) => state.MainSPContext.value
  );

  console.log("mainContext: ", mainContext);

  const peoplePickerData = {
    id: selectedItem?.id,
    email: selectedItem?.secondaryText,
    name: selectedItem?.text,
    imageURL: `${CONFIG.webURL}${
      selectedItem?.imageUrl?.split("undefined")[1]
    }`,
  };

  console.log("peoplePickerData: ", peoplePickerData);

  const handleChange = useCallback(
    (e: any) => {
      onChange(e);
    },
    [onChange]
  );

  return (
    <>
      <PeoplePicker
        context={mainContext}
        webAbsoluteUrl={CONFIG.webURL}
        //   titleText="Select People"
        personSelectionLimit={personSelectionLimit}
        showtooltip={false}
        //   ensureUser={true}
        placeholder={placeholder}
        // peoplePickerCntrlclassName={styles.}
        onChange={(e: any) => {
          handleChange(e);
        }}
        styles={multiPeoplePickerStyle}
        //   showHiddenInUI={true}
        principalTypes={[PrincipalType.User]}
        // defaultSelectedUsers={peoplePickerData.email}
        resolveDelay={1000}
      />
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
    </>
  );
};

export default CustomPeoplePicker;
