/* eslint-disable no-debugger */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect } from "react";
import { Add, Close } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import styles from "./SDDSections.module.scss";
import CustomInput from "../common/CustomInputFields/CustomInput";
import { FormControlLabel } from "@mui/material";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { emptyCheck } from "../../../../utils/validations";
import ErrorIcon from "@mui/icons-material/Error";

interface Props {
  sectionsData: any;
  AllSectionsData?: any;
  setSectionsData: any;
  isValid?: any;
  errorMsg?: string;
  sectionTitle: string;
  objKey?: any;
  viewOnly?: any;
  update?: boolean;
}

const SDDSections = ({
  sectionsData,
  AllSectionsData,
  setSectionsData,
  isValid,
  errorMsg,
  sectionTitle,
  objKey,
  viewOnly,
  update,
}: Props): JSX.Element => {
  const isNotDefaultSection: boolean =
    sectionsData[0]?.type?.toLowerCase() !== "defaultsection";

  const sectionErrorKey: string =
    objKey === "normalSection" ? "normalSectionError" : "appendixSectionError";

  const handleRemoveUser = (index: number): void => {
    const updatedSectionsOnUpdate = sectionsData?.map(
      (data: any, idx: number) => {
        if (update && idx === index) {
          return {
            ...data,
            removed: true,
          };
        } else {
          return data;
        }
      }
    );

    const updatedSections = !update
      ? sectionsData.filter((_: any, idx: number) => idx !== index)
      : update && sectionsData[index]?.unqID === null
      ? sectionsData.filter((_: any, idx: number) => idx !== index)
      : [];

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]:
        update && sectionsData[index]?.unqID !== null
          ? updatedSectionsOnUpdate
          : updatedSections,
    }));

    const temp: any = update ? updatedSectionsOnUpdate : updatedSections;

    // Check for duplicates
    const valuesCount = temp.reduce(
      (acc: Record<string, number>, section: any) => {
        if (!section.removed) {
          acc[section.value] = (acc[section.value] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    const isDuplicate = Object.values(valuesCount).some(
      (count: any) => count > 1
    );

    setSectionsData((prev: any) => ({
      ...prev,
      [sectionErrorKey]: {
        isValid: !isDuplicate,
        errorMsg: !isDuplicate ? "" : "Duplicate sections found!",
      },
    }));
  };

  const handleAddUser = (): void => {
    // Check if the sectionsData array exists and has valid entries
    const lastItem = sectionsData?.[sectionsData?.length - 1];

    if (!lastItem || emptyCheck(lastItem.value)) {
      const newUser = {
        id: sectionsData?.length + 1,
        unqID: null,
        type: objKey,
        isValid: true,
        value: "",
      };

      setSectionsData((prev: any) => ({
        ...prev,
        [objKey]: [...(prev[objKey] || []), newUser],
      }));
    } else {
      setSectionsData((prev: any) => ({
        ...prev,
        [objKey]: prev[objKey].map((item: any) =>
          item.id === lastItem.id ? { ...item, isValid: false } : item
        ),
      }));
    }
  };

  const handleChange = (index: number, value: string): void => {
    const updatedSections = sectionsData?.map((user: any, idx: number) => {
      if (idx === index) {
        return { ...user, value: value, isValid: emptyCheck(value) };
      }
      return user;
    });

    // Check for duplicates
    const isDuplicate = updatedSections.some(
      (section: any, idx: number) =>
        !section.removed && section.value === value && idx !== index
    );

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
      [sectionErrorKey]: {
        isValid: !isDuplicate,
        errorMsg: !isDuplicate ? "" : "Duplicate sections found!",
      },
    }));
  };

  const handleSelectSection = (index: number, value: string): void => {
    const updatedSections = sectionsData?.map((user: any, idx: number) =>
      idx === index ? { ...user, sectionSelected: value } : user
    );

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  };

  useEffect(() => {
    const updatedSections = sectionsData?.map((user: any, idx: number) => ({
      ...user,
      id: idx + 1,
      type: objKey,
    }));

    setSectionsData((prev: any) => ({
      ...prev,
      [objKey]: updatedSections,
    }));
  }, []);

  const checkDuplicates = (): boolean => {
    const allSections = [
      ...AllSectionsData[objKey],
      ...AllSectionsData.defaultSection,
    ];

    const valuesCount = allSections.reduce(
      (acc: Record<string, number>, section: any) => {
        if (!section.removed) {
          if (section && section.value) {
            const valueKey = section.value.trim().toLowerCase();
            acc[valueKey] = (acc[valueKey] || 0) + 1;
          }
        }
        return acc;
      },
      {}
    );

    return Object.values(valuesCount).some((count: number) => count > 1);
  };

  const hasDuplicates = !viewOnly ? checkDuplicates() : false;

  return (
    <div className={styles.mainWrapper}>
      {((!viewOnly && !AllSectionsData[sectionErrorKey]?.isValid) ||
        hasDuplicates) &&
      isNotDefaultSection ? (
        <span className={styles.errorBadge}>
          {AllSectionsData[sectionErrorKey]?.errorMsg ||
            "Duplicate sections found!"}
        </span>
      ) : (
        ""
      )}
      <div className={`${styles.sectionWrapper}`}>
        <div className={styles.header}>
          <p className={styles.userCount}>{sectionTitle} </p>
          {sectionsData[0]?.type?.toLowerCase() !== "defaultsection" &&
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

        <div className={`${styles.userCardsWrapper} `}>
          {sectionsData?.length !== 0 ? (
            sectionsData?.map(
              (user: any, i: number) =>
                !user?.removed && (
                  <div
                    className={`${styles.usersCard} ${
                      user?.sectionSelected ? styles.checkedUserCard : ""
                    }`}
                    style={{
                      border: !user?.isValid ? "1px solid #ff6d6d" : "",
                    }}
                    key={i}
                  >
                    {!isNotDefaultSection &&
                    sectionsData[0]?.type?.toLowerCase() ===
                      "defaultsection" ? (
                      <FormControlLabel
                        label={user.value}
                        className="SDDcheckBox"
                        style={{
                          paddingLeft: "18px",
                          fontSize: "14px",
                          fontFamily: "interRegular, sans-serif",
                        }}
                        control={
                          <Checkbox
                            checkedIcon={<RadioButtonCheckedIcon />}
                            icon={<RadioButtonUncheckedIcon />}
                            key={i}
                            name={user?.value}
                            value={user?.sectionSelected}
                            checked={user?.sectionSelected}
                            id={user.value}
                            onChange={(e: any) => {
                              !viewOnly &&
                                handleSelectSection(i, e.target.checked);
                            }}
                          />
                        }
                      />
                    ) : (
                      <CustomInput
                        key={i}
                        readOnly={viewOnly || false}
                        size="SM"
                        icon={false}
                        onChange={(value: any) => handleChange(i, value)}
                        value={user?.value}
                        placeholder="Enter here"
                        isValid={!user?.isValid}
                        inputWrapperClassName={`${styles.sectionInput}`}
                      />
                    )}
                    {i !== 0 && isNotDefaultSection && !viewOnly && (
                      <Close
                        onClick={() => handleRemoveUser(i)}
                        className={styles.deleteUser}
                      />
                    )}

                    {!user.isValid && (
                      <ErrorIcon
                        className={`${
                          !user.isValid
                            ? styles.errorMsgIconActive
                            : styles.errorMsgIcon
                        }`}
                        style={{
                          color: "#C80036",
                          fontSize: "24px",
                        }}
                      />
                    )}
                  </div>
                )
            )
          ) : (
            <div className={styles.defText}>No sections found</div>
          )}
        </div>
      </div>
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
    </div>
  );
};

export default memo(SDDSections);
