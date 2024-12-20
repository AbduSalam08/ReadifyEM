/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable no-unused-expressions */
// /* eslint-disable @typescript-eslint/explicit-function-return-type */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import { InputSwitch } from "primereact/inputswitch";
import styles from "./ConfigureSectionCard.module.scss";
import CustomPeoplePicker from "../common/CustomInputFields/CustomPeoplePicker";
import DefaultButton from "../common/Buttons/DefaultButton";
import CustomInput from "../common/CustomInputFields/CustomInput";
import { OrderList } from "primereact/orderlist";
import { handleKeyDown } from "../../../../utils/validations";
import DeleteIcon from "@mui/icons-material/Delete";
import { checkDuplicatesForSDD } from "../../../../utils/SDDUtils";
import { memo, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Fade, Tooltip } from "@mui/material";
import { CurrentUserIsAdmin } from "../../../../constants/DefineUser";

interface SectionsProps {
  sectionTitle: string;
  addNewButtonText: string;
  sections: any;
  setSections: any;
  objKey?: string | any;
  handleDrag?: any;
}

const ConfigureSectionCard: React.FC<SectionsProps> = ({
  sectionTitle,
  addNewButtonText,
  sections,
  objKey,
  setSections,
  handleDrag,
}) => {
  const filteredSection = sections[objKey]?.filter(
    (item: any) => !item?.removed
  );
  const isAdmin: boolean = CurrentUserIsAdmin();

  // const definitionsAuthors: any = sections[objKey]?.filter(
  //   (item: any) =>
  //     item?.sectionType?.toLowerCase() === "defaultsection" &&
  //     item?.sectionName?.value?.toLowerCase() === "definitions"
  // )[0];

  // const referenceSectionIndex: number = sections[objKey]?.findIndex(
  //   (item: any) => {
  //     // Safely check if sectionType and sectionName exist and match the expected values
  //     const sectionType = item?.sectionType?.toLowerCase();
  //     const sectionName = item?.sectionName?.value?.toLowerCase();

  //     return (
  //       sectionType === "referencessection" && sectionName === "references"
  //     );
  //   }
  // );

  const handleOnChange = (
    index: number,
    field: string,
    value: string | any
  ): void => {
    setSections((prevState: any) => {
      // const validSections = prevState[objKey]?.filter(
      //   (item: any) => !item?.removed
      // );
      const validSections = prevState[objKey];

      const updatedSections = [...validSections];

      const updatedSection =
        field === "removed" ||
        field === "sectionSelected" ||
        field === "sectionOrderNo"
          ? {
              ...updatedSections[index],
              [field]: value,
            }
          : {
              ...updatedSections[index],
              [field]: {
                ...updatedSections[index]?.[field],
                value,
                isValid:
                  field === "sectionName"
                    ? value.trim() !== ""
                    : Array.isArray(value)
                    ? value.length > 0
                    : true,
              },
            };

      updatedSection.sectionIsValid =
        updatedSection?.sectionName?.isValid &&
        updatedSection?.sectionAuthor?.isValid &&
        updatedSection?.consultants?.isValid;

      updatedSections[index] = updatedSection;

      const checkDuplicatesForSDD = (sections: any[]): boolean => {
        const sectionNames = sections
          .filter((section) => section.sectionSelected && !section?.removed)
          .map((section) => section.sectionName.value.trim());
        const uniqueNames = new Set(sectionNames);
        return sectionNames.length !== uniqueNames.size;
      };

      const updatedSectionsData = { ...prevState, [objKey]: updatedSections };

      if (objKey?.toLowerCase() === "defaultsections") {
        const selectedDefaultSections = updatedSections.filter(
          (el: any) => el?.sectionSelected
        );
        updatedSectionsData[`${objKey}Error`] = {
          isValid: !(
            selectedDefaultSections.length === 0 ||
            checkDuplicatesForSDD(updatedSections)
          ),
          errorMsg:
            selectedDefaultSections.length === 0
              ? "No sections selected"
              : checkDuplicatesForSDD(updatedSections)
              ? "Duplicate sections found"
              : "",
        };
      } else if (objKey?.toLowerCase() === "appendixsections") {
        updatedSectionsData[`${objKey}Error`] = {
          isValid: !checkDuplicatesForSDD(updatedSections),
          errorMsg: checkDuplicatesForSDD(updatedSections)
            ? "Duplicate sections found"
            : "",
        };
      }

      return updatedSectionsData;
    });
  };

  const handleAddSection = (type: string) => {
    setSections((prevState: any) => {
      // Check if any section is invalid
      const isAnyInvalid = prevState[objKey]?.some(
        (section: any) => !section.sectionName.value.trim()
        // section.sectionAuthor.value.length === 0 ||
        // section.consultants.value.length === 0
      );

      if (isAnyInvalid) {
        // Mark all invalid sections as invalid and return the previous state
        const updatedSections = prevState[objKey]?.map((section: any) => ({
          ...section,
          sectionName: {
            ...section.sectionName,
            isValid: !!section.sectionName.value.trim(),
          },
        }));

        return { ...prevState, [objKey]: updatedSections };
      } else {
        // All sections are valid, proceed to add the new section
        const newSection = {
          ID: null,
          templateSectionID: null,
          sectionOrderNo: String(
            prevState[objKey]?.length + 1
            // prevState[objKey]?.filter((item: any) => !item?.removed)?.length + 1
          ),
          sectionName: {
            value: "",
            placeHolder: "Section name",
            isValid: true,
          },
          sectionAuthor: {
            value: [],
            placeHolder: "Section author",
            isValid: true,
          },
          consultants: {
            value: [],
            placeHolder: "Consultants",
            isValid: true,
            personSelectionLimit: 10,
          },
          sectionSelected: true,
          sectionType: type,
          removed: false,
          sectionIsValid: true,
        };

        return { ...prevState, [objKey]: [...prevState[objKey], newSection] };
      }
    });
  };

  // const handleDeleteRow = (currentItemIndex: number) => {
  //   const filteredData = sections[objKey]?.filter(
  //     (item: any, index: number) => {
  //       return index !== currentItemIndex;
  //     }
  //   );

  //   reOrderSections(filteredData);
  // };

  const handleDeleteRow = (currentItemIndex: number) => {
    // Map through the sections and mark the item at the current index as removed
    const updatedData = sections[objKey]?.map((item: any, index: number) => {
      if (index === currentItemIndex) {
        // Mark the item as removed instead of removing it
        return { ...item, removed: true };
      }
      return item;
    });

    // Call reOrderSections with the updated data
    reOrderSections(updatedData);
  };

  const hasDuplicates = checkDuplicatesForSDD(sections[objKey]);

  const SectionRow = (section: any): JSX.Element => {
    const sectionName = section?.sectionName?.value;
    const sectionSelected = section?.sectionSelected;
    const sectionAuthorPlaceholder = "Section author";
    const consultantPlaceholder = "Consultants";
    const personSelectionLimit = 10;
    const sectionType = section?.sectionType;
    // const referenceSection =
    //   section?.sectionType?.toLowerCase() === "referencessection";
    // const definitionSection =
    //   section?.sectionType?.toLowerCase() === "defaultsection" &&
    //   section?.sectionName?.value?.toLowerCase() === "definitions";

    const sectionInputPlaceHolder: string =
      sectionType === "defaultSection"
        ? "Section Name"
        : sectionType === "appendixSection"
        ? "Appendix Name"
        : "Section Name";

    const currentItemIndex: number = sections[objKey]?.findIndex(
      (item: any) => section?.sectionOrderNo === item?.sectionOrderNo
    );

    const toolTipData: string =
      sectionName?.toLowerCase() === "definitions"
        ? "Easily add and manage definitions within the document."
        : sectionName?.toLowerCase() === "supporting materials"
        ? "Easily select or add documents, system hyperlinks titles for easy access."
        : sectionName?.toLowerCase() === "references"
        ? "Easily manage and format references within the document."
        : "";

    return (
      <div className={styles.sectionWrap}>
        <div
          className={`${
            sectionSelected ? styles.sectionRowActive : styles.sectionRow
          }`}
          key={section?.sectionOrderNo}
        >
          <div className={styles.dragHandle}>
            <span />
            <span />
          </div>

          <span
            className={styles.sectionName}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              position: "relative",
            }}
          >
            <CustomInput
              value={sectionName}
              readOnly={
                section?.readOnlySection ||
                (section?.templateSectionID && !isAdmin)
              }
              autoFocus={section?.readOnlySection ? false : true}
              isValid={!section?.sectionName?.isValid}
              onChange={(value: string) => {
                handleOnChange(currentItemIndex, "sectionName", value);
              }}
              noErrorMsg={true}
              onKeyDown={(event: any) => {
                handleKeyDown(event, sectionName, (newValue: string) =>
                  handleOnChange(currentItemIndex, "sectionName", newValue)
                );
              }}
              type="text"
              inputWrapperClassName={
                !section?.sectionName?.isValid
                  ? styles.sectionInputError
                  : styles.sectionInputWrapper
              }
              inputClassName={styles.sectionInput}
              placeholder={sectionInputPlaceHolder}
            />
            {(sectionName?.toLowerCase() === "supporting materials" ||
              sectionName?.toLowerCase() === "definitions" ||
              sectionName?.toLowerCase() === "references") && (
              <Tooltip
                title={toolTipData}
                placement="right"
                arrow
                TransitionComponent={Fade}
              >
                <InfoIcon
                  sx={{
                    position: "absolute",
                    right: "0",
                    // top: "6px",
                    color: "#0360a4",
                  }}
                />
              </Tooltip>
            )}
          </span>

          <div className={styles.enableSectionSwitch}>
            {/* <InputSwitch
              checked={
                referenceSection
                  ? !definitionsAuthors?.sectionSelected
                    ? false
                    : sectionSelected || section?.isActive
                  : sectionSelected || section?.isActive
              }
              className="sectionToggler"
              disabled={section?.templateSectionID && !isAdmin}
              onChange={(e) => {
                if (definitionSection) {
                  handleOnChange(currentItemIndex, "sectionSelected", false);
                  handleOnChange(
                    referenceSectionIndex,
                    "sectionSelected",
                    false
                  );
                } else {
                  handleOnChange(currentItemIndex, "sectionSelected", e?.value);
                }
              }}
            /> */}
            <InputSwitch
              checked={
                // referenceSection
                //   ? definitionsAuthors?.sectionSelected
                //     ? sectionSelected || section?.isActive
                //     : false
                //   : sectionSelected || section?.isActive
                sectionSelected || section?.isActive
              }
              className="sectionToggler"
              disabled={
                // referenceSection
                //   ? !definitionsAuthors?.sectionSelected
                //   : !!section?.templateSectionID && !isAdmin
                !!section?.templateSectionID && !isAdmin
              }
              onChange={(e) => {
                // If it's a definition section, handle both current and reference sections
                handleOnChange(currentItemIndex, "sectionSelected", e?.value);
                // if (definitionSection) {
                //     handleOnChange(
                //       referenceSectionIndex,
                //       "sectionSelected",
                //       e?.value
                //     );
                //   }
              }}
            />
          </div>
          <div className={styles.sectionAuthor}>
            <CustomPeoplePicker
              isValid={!section?.sectionAuthor.isValid}
              onChange={(value: any) => {
                handleOnChange(currentItemIndex, "sectionAuthor", value);
                // if (definitionSection) {
                //   handleOnChange(referenceSectionIndex, "sectionAuthor", value);
                // }
              }}
              noErrorMsg={true}
              minWidth={"100%"}
              selectedItem={
                // referenceSection
                //   ? definitionsAuthors?.sectionAuthor?.value[0]
                //       ?.secondaryText ||
                //     definitionsAuthors?.sectionAuthor?.value[0]?.email
                //   : section.sectionAuthor?.value[0]?.secondaryText ||
                //     section.sectionAuthor?.value[0]?.email
                section.sectionAuthor?.value[0]?.secondaryText ||
                section.sectionAuthor?.value[0]?.email
              }
              size="SM"
              placeholder={sectionAuthorPlaceholder}
              personSelectionLimit={1}
              // readOnly={referenceSection}
              // noRemoveBtn={referenceSection}
              // disabled={referenceSection}
            />
          </div>
          <div className={styles.consultant}>
            <CustomPeoplePicker
              isValid={!section?.consultants.isValid}
              onChange={(value: any) => {
                handleOnChange(currentItemIndex, "consultants", value);
                // if (definitionSection) {
                //   handleOnChange(referenceSectionIndex, "consultants", value);
                // }
              }}
              noErrorMsg={true}
              minWidth={"100%"}
              size="SM"
              selectedItem={
                // referenceSection
                //   ? definitionsAuthors?.consultants?.value
                //   : section?.consultants?.value
                section?.consultants?.value
              }
              placeholder={consultantPlaceholder}
              personSelectionLimit={personSelectionLimit}
              multiUsers={true}
              popupControl={true}
              // readOnly={referenceSection}
              // noRemoveBtn={referenceSection}
              // disabled={referenceSection}
            />
          </div>
        </div>
        {!isAdmin
          ? !section?.templateSectionID &&
            (currentItemIndex !== 0 || sectionType === "appendixSection") && (
              // !referenceSection && (
              <button
                className={styles.deleteIcon}
                onClick={() => {
                  if (section?.templateSectionID === null) {
                    handleDeleteRow(currentItemIndex);
                  } else {
                    handleOnChange(currentItemIndex, "removed", true);
                    // handleOnChange(currentItemIndex, "sectionOrderNo", "0");
                  }
                }}
              >
                <DeleteIcon />
              </button>
            )
          : (currentItemIndex !== 0 || sectionType === "appendixSection") && (
              // !referenceSection && (
              <button
                className={styles.deleteIcon}
                onClick={() => {
                  if (section?.templateSectionID === null) {
                    handleDeleteRow(currentItemIndex);
                  } else {
                    handleOnChange(currentItemIndex, "removed", true);
                    // handleOnChange(currentItemIndex, "sectionOrderNo", "0");
                  }
                }}
              >
                <DeleteIcon />
              </button>
            )}
      </div>
    );
  };

  const reOrderSections = (data: any[]): any => {
    const updateData: any[] = data?.map((item: any, index: number) => {
      return {
        ...item,
        sectionOrderNo: String(index + 1),
      };
    });

    setSections((prev: any) => {
      return {
        ...prev,
        [objKey]: [...updateData],
      };
    });
  };

  useEffect(() => {
    // const tempFilteredSectionDetails = filteredSection.sort(
    //   (a: any, b: any) => a?.sectionOrderNo - b?.sectionOrderNo
    // );
    reOrderSections(filteredSection);
  }, []);

  return (
    <div className={styles.sectionsWrapper}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          {sectionTitle}
          {(hasDuplicates || !sections?.[`${objKey}Error`]?.isValid) && (
            <span className={styles.errorMsg}>
              {sections?.[`${objKey}Error`]?.errorMsg ||
                "Duplicate sections found"}
            </span>
          )}
        </div>
        <DefaultButton
          btnType="secondaryBlue"
          text={addNewButtonText}
          onClick={() => {
            const sectionType: string =
              objKey === "defaultSections"
                ? "defaultSection"
                : "appendixSection";
            handleAddSection(sectionType);
          }}
          style={{
            width: "150px",
          }}
        />
      </div>
      <div className={styles.sections}>
        {sections[objKey]?.length !== 0 ? (
          <OrderList
            className="sectionRowDropList"
            key={objKey}
            value={sections[objKey]?.filter(
              (item: any) =>
                !item?.removed && item !== undefined && item !== null
            )}
            dataKey={"sectionOrderNo"}
            itemTemplate={SectionRow}
            dragdrop
            onChange={(event: any) => {
              const { value } = event;
              reOrderSections(value);
              // handleDrag(objKey, value);
            }}
            focusOnHover={false}
          ></OrderList>
        ) : (
          <span className={styles.emtpyMsg}>Empty section</span>
        )}
      </div>
    </div>
  );
};

export default memo(ConfigureSectionCard);
