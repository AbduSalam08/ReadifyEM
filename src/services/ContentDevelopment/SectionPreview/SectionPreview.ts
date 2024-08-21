/* eslint-disable @typescript-eslint/no-explicit-any */

import { LISTNAMES } from "../../../config/config";
import SpServices from "../../SPServices/SpServices";

const readTextFileFromTXT = (
  data: any,
  setSectionAttachmentState: any
): void => {
  // setSectionLoader(true);
  SpServices.SPReadAttachments({
    ListName: "SectionDetails",
    ListID: data.ID,
    AttachmentName: data?.FileName,
  })
    .then((res: any) => {
      console.log(res);
      setSectionAttachmentState(JSON.parse(res));
    })
    .catch((err: any) => {
      console.log("err: ", err);
      // setSectionLoader(false);
    });
};

export const getSectionAttachment = async (
  sectionId: number,
  sectionDetails: any,
  setSectionAttachmentState: any
): Promise<void> => {
  console.log(sectionId, sectionDetails);

  let sectionObject: any = {};
  const tempAttachments: any[] = [];
  const attachments = await SpServices.SPGetAttachments({
    Listname: LISTNAMES.SectionDetails,
    ID: sectionId,
  });
  if (attachments.length !== 0) {
    sectionObject = {
      ...attachments[0],
      ID: sectionId,
      sectionName: sectionDetails.sectionName,
      sectionOrder: sectionDetails.sectionOrder,
    };
    attachments[0] = sectionObject;
    tempAttachments.push(attachments);
    readTextFileFromTXT(attachments[0], setSectionAttachmentState);
  } else {
    setSectionAttachmentState("empty");
    console.log("empty");
  }
  //   setSectionAttachmentState([...tempAttachments]);
};
