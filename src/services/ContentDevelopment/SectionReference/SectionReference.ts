/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { LISTNAMES } from "../../../config/config";
import SpServices from "../../SPServices/SpServices";
import {
  AddReferenceAttachment,
  convertReferenceToTxtFile,
  findReferenceSectionNumber,
} from "../SectionDefinition/SectionDefinitionServices";

const getSectionRefernces = async (sectionId: number): Promise<any> => {
  try {
    const referencesDatas: any[] = [];
    await SpServices.SPReadItems({
      Listname: LISTNAMES.sectionReferences,
      Filter: [
        {
          FilterKey: "sectionDetails",
          Operator: "eq",
          FilterValue: sectionId,
        },
      ],
    }).then((res) => {
      debugger;
      if (res.length !== 0) {
        res.forEach((item) => {
          referencesDatas.push({
            ID: item.ID,
            referenceTitle: item.referenceTitle,
            referenceAuthorName: item.referenceAuthorName,
            yearOfPublish: item.yearOfPublish,
            referenceLink: item.referenceLink,
            IsValid: true,
            ErrorMsg: "",
            IsDuplicate: false,
            isApproved: true,
            isLoading: false,
            isSectionReferences: true,
          });
        });
      }
    });
    return referencesDatas;
  } catch (err) {
    console.error(err);
  }
};

const addNewReference = async (
  referenceData: any,
  AllSectionsDataMain: any[],
  documentId: number,
  sectionId: number,
  setLoaderState: any,
  setToastState: any,
  allReferencesData: any[],
  setAllReferencesData: any,
  setInitialLoader: any,
  setPopupController: any,
  togglePopupVisibility: any
) => {
  try {
    const referenceSectionNumber = await findReferenceSectionNumber(
      AllSectionsDataMain,
      documentId
    );
    setInitialLoader(true);
    // setLoaderState({
    //   isLoading: { inprogress: true, success: false, error: false },
    //   visibility: true,
    //   text: "Updating reference, please wait...",
    //   secondaryText: "",
    // });
    const jsonObject = {
      referenceTitle: referenceData.referenceTitle,
      referenceAuthorName: referenceData.referenceAuthorName,
      yearOfPublish: referenceData.yearOfPublish,
      referenceLink: referenceData.referenceLink,
      //   isSectionDefinition: true,
      sectionDetailsId: sectionId,
      docDetailsId: documentId,
    };
    await SpServices.SPAddItem({
      Listname: LISTNAMES.sectionReferences,
      RequestJSON: jsonObject,
    })
      .then(async (referenceRes: any) => {
        console.log(referenceRes);
        // setLoaderState({
        //   isLoading: {
        //     inprogress: false,
        //     success: true,
        //     error: false,
        //   },
        //   visibility: true,
        //   text: `Definition created successfully!`,
        //   secondaryText: `The Standardized definition template "${definitionsData?.definitionName}" has been created successfully! `,
        // });
        // const sectionDefinitions = await getAllSectionDefinitions(
        //   documentId,
        //   sectionId
        // );
        // const tempSectionDefinitions = await sectionDefinitions.filter(
        //   (obj: any) => !obj.isDeleted
        // );
        togglePopupVisibility(setPopupController, 0, "close");
        allReferencesData.push({
          referenceTitle: referenceData.referenceTitle,
          referenceAuthorName: referenceData.referenceAuthorName,
          yearOfPublish: referenceData.yearOfPublish,
          referenceLink: referenceData.referenceLink,
          //   isSectionDefinition: true,
          sectionDetailsId: sectionId,
          docDetailsId: documentId,
        });
        // console.log("sectionDefinitions", tempSectionDefinitions);
        // const _file: any = await convertDefinitionsToTxtFile(
        //   await tempSectionDefinitions,
        //   sectionOrder
        // );
        // AddSectionAttachment(sectionId, _file);
        const reference_file: any = await convertReferenceToTxtFile(
          [...allReferencesData],
          await referenceSectionNumber
        );
        AddReferenceAttachment(documentId, reference_file);
        setAllReferencesData((prev: any) => [
          {
            ID: referenceRes.data.ID,
            referenceTitle: referenceData.referenceTitle,
            referenceAuthorName: referenceData.referenceAuthorName,
            yearOfPublish: referenceData.yearOfPublish,
            referenceLink: referenceData.referenceLink,
            isSectionDefinition: true,
            isDeleted: false,
            isNew: false,
            isSelected: false,
            status: false,
          },
          ...prev,
        ]);
        setToastState({
          isShow: true,
          severity: "success",
          title: "Section updated",
          message: "section has been updated successfully!",
          duration: 3000,
        });
        setInitialLoader(false);
        // setLoaderState({
        //   isLoading: {
        //     inprogress: false,
        //     success: true,
        //     error: false,
        //   },
        //   visibility: true,
        //   text: `Reference added successfully!`,
        //   secondaryText: `Reference added successfully`,
        // });
      })
      .catch((err) => {
        console.log(err);
        setLoaderState({
          isLoading: {
            inprogress: false,
            success: false,
            error: true,
          },
          visibility: true,
          text: "Unable to create the definition.",
          secondaryText:
            "An unexpected error occurred while create the definition, please try again later.",
        });
      });
  } catch (err) {
    setLoaderState({
      isLoading: {
        inprogress: false,
        success: false,
        error: true,
      },
      visibility: true,
      text: "Unable to create the definition.",
      secondaryText:
        "An unexpected error occurred while create the definition, please try again later.",
    });
  }
};

const UpdateReference = async (
  referenceData: any,
  AllSectionsDataMain: any[],
  documentId: number,
  sectionId: number,
  setLoaderState: any,
  setToastState: any,
  allReferencesData: any[],
  setAllReferencesData: any,
  setInitialLoader: any,
  setPopupController: any,
  togglePopupVisibility: any
) => {
  try {
    debugger;
    const referenceSectionNumber = await findReferenceSectionNumber(
      AllSectionsDataMain,
      documentId
    );
    setInitialLoader(true);
    const jsonObject = {
      referenceTitle: referenceData.referenceTitle,
      referenceAuthorName: referenceData.referenceAuthorName,
      yearOfPublish: referenceData.yearOfPublish,
      referenceLink: referenceData.referenceLink,
    };
    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.sectionReferences,
      ID: referenceData.ID,
      RequestJSON: jsonObject,
    }).then(async (res: any) => {
      console.log(res);
      togglePopupVisibility(setPopupController, 2, "close");
      const updateReferenceData = allReferencesData.map((obj: any) => {
        if (obj.ID === referenceData.ID) {
          let referenceDetails = {
            ...obj,
            ...jsonObject,
          };
          return referenceDetails;
        } else {
          return obj;
        }
      });
      console.log(updateReferenceData);

      const reference_file: any = await convertReferenceToTxtFile(
        [...updateReferenceData],
        await referenceSectionNumber
      );
      AddReferenceAttachment(documentId, reference_file);
      setAllReferencesData([...updateReferenceData]);
      setToastState({
        isShow: true,
        severity: "success",
        title: "Section updated",
        message: "section has been updated successfully!",
        duration: 3000,
      });
      setInitialLoader(false);
    });
  } catch (err) {
    console.log(err);
  }
};

const submitSectionReferences = async (
  allReferencesData: any[],
  setAllReferencesData: any,
  AllSectionsDataMain: any,
  documentId: number,
  setLoader: any,
  setToastState: any,
  submitCondition: boolean
) => {
  try {
    debugger;
    const referenceSectionNumber = await findReferenceSectionNumber(
      AllSectionsDataMain,
      documentId
    );
    allReferencesData.forEach(async (obj: any, index: number) => {
      if (obj.isDeleted) {
        SpServices.SPDeleteItem({
          Listname: LISTNAMES.sectionReferences,
          ID: obj.ID,
        });
      }
      if (allReferencesData.length - 1 === index) {
        const tempArray = allReferencesData.filter(
          (item: any) => !item.isDeleted
        );
        const reference_file: any = await convertReferenceToTxtFile(
          [...tempArray],
          await referenceSectionNumber
        );
        AddReferenceAttachment(documentId, reference_file);
        setAllReferencesData([...tempArray]);
        setLoader(false);
        if (!submitCondition) {
          setToastState({
            isShow: true,
            severity: "success",
            title: "Section save",
            message: "section has been saved successfully!",
            duration: 3000,
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export {
  addNewReference,
  getSectionRefernces,
  UpdateReference,
  submitSectionReferences,
};
