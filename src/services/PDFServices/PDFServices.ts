import { LISTNAMES } from "../../config/config";
// import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
import SpServices from "../SPServices/SpServices";

const readTextFileFromTXT = (
  data: any,
  length: number,
  index: number,
  setAllSectionContent: any,
  setLoader: any
): void => {
  SpServices.SPReadAttachments({
    ListName: "SectionDetails",
    ListID: data.ID,
    AttachmentName: data?.FileName,
  })
    .then((res: any) => {
      const parsedValue: any = JSON.parse(res);
      const sectionDetails = {
        text: data.sectionName,
        sectionOrder: data.sectionOrder,
        value: parsedValue,
      };
      setAllSectionContent((prev: any) => {
        // Add the new sectionDetails to the previous state
        const updatedSections = [...prev, sectionDetails];

        // Sort the updatedSections array by the "sectionOrder" key
        updatedSections.sort((a, b) => {
          return parseInt(a.sectionOrder) - parseInt(b.sectionOrder);
        });

        // Return the sorted array to update the state
        return updatedSections;
      });
      if (index + 1 === length) {
        setLoader(false);
      }
    })
    .catch((err: any) => {
      console.log("err: ", err);
    });
};

export const getDocumentRelatedSections = async (
  documentID: number,
  setAllSectionContent: any,
  setLoader: any
): Promise<any> => {
  try {
    setLoader(true);
    SpServices.SPReadItems({
      Listname: LISTNAMES.SectionDetails,
      Select: "*,documentOf/ID",
      Expand: "documentOf",
      Filter: [
        {
          FilterKey: "documentOf",
          Operator: "eq",
          FilterValue: documentID,
        },
      ],
    })
      .then(async (res: any) => {
        console.log(res);
        if (res.length > 0) {
          const sortedArray = res.sort(
            (a: any, b: any) =>
              parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
          );
          let sectionObject: any = {};
          const tempAttachments: any[] = [];
          console.log(sortedArray);

          for (const item of sortedArray) {
            console.log(item.sectionOrder);
            let attachments = await SpServices.SPGetAttachments({
              Listname: LISTNAMES.SectionDetails,
              ID: item.Id,
            });
            if (attachments.length !== 0) {
              sectionObject = {
                ...attachments[0],
                ID: item.Id,
                sectionName: item.Title,
                sectionOrder: item.sectionOrder,
              };
              attachments[0] = sectionObject;
              tempAttachments.push(attachments);
            }
          }
          console.log(tempAttachments);
          // dispatcher(setSectionsAttachments([...tempAttachments]));
          if (tempAttachments.length !== 0) {
            tempAttachments.forEach((item: any, index: number) => {
              const filteredItem: any = item?.filter(
                (item: any) => item?.FileName === "Sample.txt"
              );
              if (filteredItem.length > 0) {
                readTextFileFromTXT(
                  filteredItem[0],
                  tempAttachments.length,
                  index,
                  setAllSectionContent,
                  setLoader
                );
              } else {
                // setSectionLoader(false);
              }
            });
          } else {
            setLoader(false);
          }
        } else {
          setLoader(false);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
  }
};
