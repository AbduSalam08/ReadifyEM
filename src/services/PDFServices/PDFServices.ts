import { LISTNAMES } from "../../config/config";
import { setSectionsAttachments } from "../../redux/features/PDFServicceSlice";
import SpServices from "../SPServices/SpServices";

export const getDocumentRelatedSections = async (
  documentID: number,
  dispatcher: any
) => {
  try {
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
        // const sortedArray = res.sort(
        //   (a: any, b: any) => Number(b.sectionOrder) > Number(a.sectionOrder)
        //   );
        const sortedArray = res.sort(
          (a: any, b: any) =>
            parseInt(a.sectionOrder) - parseInt(b.sectionOrder)
        );
        let sectionObject: any = {};
        let tempAttachments: any[] = [];
        console.log(sortedArray);

        for (const item of sortedArray) {
          // const attachments = await sp.web.lists
          //   .getByTitle("YourListName")
          //   .items.getById(item.Id)
          //       .attachmentFiles();
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
          //   tempAttachments.push(attachments);
          console.log(attachments);
        }
        console.log(tempAttachments);
        dispatcher(setSectionsAttachments([...tempAttachments]));
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
    return false;
  }
};
