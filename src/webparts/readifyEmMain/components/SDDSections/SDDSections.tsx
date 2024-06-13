/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add, Close } from "@mui/icons-material";
import styles from "./SDDSections.module.scss";
import { memo, useEffect } from "react";
import CustomInput from "../common/CustomInputFields/CustomInput";
import { Radio } from "@mui/material";

interface Props {
  sectionsData: any;
  setSectionsData: any;
  isValid?: any;
  errorMsg?: string;
  sectionTitle: string;
  objKey?: any;
  viewOnly?: any;
}

const SDDSections = ({
  sectionsData,
  setSectionsData,
  isValid,
  errorMsg,
  sectionTitle,
  objKey,
  viewOnly,
}: Props): JSX.Element => {
  const isNotDefaultSection: boolean =
    sectionsData[0].type?.toLowerCase() !== "defaultsection";

  const handleRemoveUser = (index: number): void => {
    const updatedSections = sectionsData.filter(
      (_: any, idx: number) => idx !== index
    );
    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  };

  const handleAddUser = (): void => {
    const newUser = {
      id: (sectionsData?.length || 0) + 1,
      type: objKey,
      isValid: true,
      value: "",
    };

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: prev[objKey] ? [...prev[objKey], newUser] : [newUser],
    }));
  };

  const handleChange = (index: number, value: string): void => {
    const updatedSections = sectionsData?.map((user: any, idx: number) =>
      idx === index ? { ...user, value: value } : user
    );

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  };

  const handleSelectSection = (index: number, value: string): void => {
    const updatedSections = sectionsData?.map((user: any, idx: number) =>
      idx === index ? { ...user, sectionSelected: !value } : user
    );

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  };

  useEffect(() => {
    const updatedSections = sectionsData?.map((user: any, idx: number) => ({
      ...user,
      type: objKey,
    }));

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  }, []);

  return (
    <>
      <div
        className={`${
          sectionsData[0].type.toLowerCase() === "normalsection"
            ? styles.normalSectionWrapper
            : styles.sectionWrapper
        }`}
      >
        <div className={styles.header}>
          <p className={styles.userCount}>{sectionTitle}</p>
          {sectionsData[0].type?.toLowerCase() !== "defaultsection" &&
            !viewOnly && (
              <button className={styles.addBtn} onClick={handleAddUser}>
                <Add
                  sx={{
                    fontSize: "18px",
                  }}
                />
              </button>
            )}
        </div>

        <div className={`${styles.userCardsWrapper}`}>
          {sectionsData?.map((user: any, i: number) => (
            <div
              className={`${styles.usersCard} 
              `}
              style={{
                border: !user.isValid ? "1px solid #ff6d6d" : "",
              }}
              key={i}
            >
              {sectionsData[0].type?.toLowerCase() === "defaultsection" && (
                <Radio
                  key={i}
                  // checked={user.sectionSelected}
                  onChange={(e) => {
                    handleSelectSection(i, e.target.value);
                  }}
                  name={user.value}
                  value={user.sectionSelected}
                  id={user.value}
                />
              )}
              {!isNotDefaultSection ? (
                <label key={i} className={styles.defaultLabel} id={user.value}>
                  {user.value}
                </label>
              ) : (
                <CustomInput
                  key={i}
                  disabled={viewOnly || false}
                  size="SM"
                  icon={false}
                  onChange={(value: any) => handleChange(i, value)}
                  value={user.value}
                  placeholder="Enter here"
                  isValid={user.isValid}
                  // errorMsg={"field can't be empty"}
                  inputWrapperClassName={`${styles.sectionInput}`}
                />
              )}
              {/*  ${
                    isNotDefaultSection && styles.checkedUserCard
                  } */}
              {i !== 0 && isNotDefaultSection && (
                <Close
                  onClick={() => handleRemoveUser(i)}
                  className={styles.deleteUser}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
    </>
  );
};

export default memo(SDDSections);
