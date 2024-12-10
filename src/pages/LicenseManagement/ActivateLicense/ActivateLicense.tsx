/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { memo, useEffect, useState } from "react";
import CustomInput from "../../../webparts/readifyEmMain/components/common/CustomInputFields/CustomInput";
import DefaultButton from "../../../webparts/readifyEmMain/components/common/Buttons/DefaultButton";
import DoneIcon from "@mui/icons-material/Done";
import styles from "./ActivateLicense.module.scss";
import PageTitle from "../../../webparts/readifyEmMain/components/common/PageTitle/PageTitle";
import {
  checkAndUpdateLicenseKey,
  checkLicenseKey,
} from "../../../services/LicenseManagement/ActiveLicenseServices";
import { useDispatch, useSelector } from "react-redux";
import CircularSpinner from "../../../webparts/readifyEmMain/components/common/AppLoader/CircularSpinner";
import AlertPopup from "../../../webparts/readifyEmMain/components/common/Popups/AlertPopup/AlertPopup";
import { IPopupLoaders } from "../../../interface/MainInterface";
import { initialPopupLoaders } from "../../../config/config";
// import { ChevronRight } from "@mui/icons-material";

const ActivateLicense = (): JSX.Element => {
  const dispatch = useDispatch();
  const licenseDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.licenseDetails
  );
  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);
  const [formData, setFormData] = useState<any>({
    ActivateKey: {
      value: "",
      isValid: false,
      errorMessage: "",
    },
  });
  const [isLoader, setIsLoader] = useState<boolean>(false);
  console.log("setFormData", formData);

  const handleInputChange = (value: string): any => {
    setFormData({
      ActivateKey: {
        value: value.trimStart(),
        isValid: value.trimStart() !== "" ? true : false,
        errorMessage: "",
      },
    });
  };
  const activationSubmit = async (): Promise<any> => {
    if (formData?.ActivateKey?.value !== "") {
      if (formData?.ActivateKey?.value === "123") {
        await checkAndUpdateLicenseKey(formData, setPopupLoaders);
      } else {
        setFormData({
          ActivateKey: {
            ...formData?.ActivateKey,
            isValid: false,
            errorMessage: "Please enter valid license key",
          },
        });
      }
    } else {
      setFormData({
        ActivateKey: {
          ...formData?.ActivateKey,
          isValid: false,
          errorMessage: "Please enter license key",
        },
      });
    }
  };

  useEffect(() => {
    if (!licenseDetails?.Valid && licenseDetails?.Message !== "") {
      setIsLoader(true);
      setFormData({
        ActivateKey: {
          value: licenseDetails?.LicenseKey,
          isValid: licenseDetails?.Valid,
          errorMessage: licenseDetails?.Message,
        },
      });
      setIsLoader(false);
    }
  }, [licenseDetails]);
  return isLoader ? (
    <div>
      <CircularSpinner />
    </div>
  ) : (
    <div className={styles.activateLicenseWrapper}>
      <div>
        <PageTitle text={"Activate License"} />
      </div>
      <div className={styles.activateLicenseInputSection}>
        <div className={styles.activateLicenseInput}>
          <CustomInput
            key={1}
            size="XL"
            icon={false}
            onChange={(value: any) => {
              handleInputChange(value);
            }}
            topLabel={true}
            labelText="License Key"
            withLabel
            placeholder="Enter your license key"
            value={formData?.ActivateKey?.value}
            isValid={!formData?.ActivateKey?.isValid}
            errorMsg={formData?.ActivateKey?.errorMessage}
          />
        </div>
      </div>
      <div className={styles.activateLicenseFooter}>
        <DefaultButton
          btnType="primary"
          text={"Activate"}
          onClick={() => activationSubmit()}
          disabled={!formData?.ActivateKey?.isValid}
          endIcon={<DoneIcon />}
        />
      </div>
      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
          checkLicenseKey(dispatch);
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
      />
    </div>
  );
};
export default memo(ActivateLicense);
