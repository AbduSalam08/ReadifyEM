/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LISTNAMES } from "../../../config/config";
import SpServices from "../../SPServices/SpServices";
import {
  setPromatedComments,
  setSectionComments,
} from "../../../redux/features/SectionCommentsSlice";
import { setCDSectionData } from "../../../redux/features/ContentDevloperSlice";

// interface definitionDetails {
//   ID: number;
//   comment: string;
//   commentAuthor: any[];
//   commentDateAndTime: string;
//   isRejectedComment: boolean;
//   role: string;
// }

const getSectionComments = async (
  sectionId: number,
  version: string,
  dispatcher: any
) => {
  debugger;
  console.log(sectionId, version);
  const tempArray: any[] = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.SectionComments,
    Select: "*,createdBy/Title,createdBy/ID,createdBy/EMail,sectionDetails/ID",
    Expand: "createdBy,sectionDetails",
    Filter: [
      {
        FilterKey: "sectionDetails",
        Operator: "eq",
        FilterValue: sectionId,
      },
      {
        FilterKey: "DocumentVersion",
        Operator: "eq",
        FilterValue: version,
      },
    ],
  })
    .then((res: any[]) => {
      console.log(res);
      res?.forEach((item: any) => {
        tempArray.push({
          ID: item.ID,
          comment: item.comments,
          commentAuthor: item?.createdBy
            ? [
                {
                  id: item?.createdBy?.ID,
                  name: item?.createdBy?.Title,
                  email: item?.createdBy?.EMail,
                },
              ]
            : [],
          commentDateAndTime: item.Created,
          role: item.role,
          isRejectedComment: item.isRejectedComment ? true : false,
        });
      });
      console.log(tempArray);
    })
    .catch((err) => console.log(err));
  dispatcher(setSectionComments(tempArray));
  return tempArray;
};

const getPromotedComments = async (
  documentID: number,
  version: string,
  dispatcher: any
) => {
  console.log(documentID);
  const tempArray: any[] = [];
  await SpServices.SPReadItems({
    Listname: LISTNAMES.PromotedComments,
    Select: "*,createdBy/Title,createdBy/ID,createdBy/EMail,documentDetails/ID",
    Expand: "createdBy,documentDetails",
    Filter: [
      {
        FilterKey: "documentDetails",
        Operator: "eq",
        FilterValue: documentID,
      },
      {
        FilterKey: "version",
        Operator: "eq",
        FilterValue: version,
      },
    ],
  })
    .then((res: any[]) => {
      console.log(res);
      res?.forEach((item: any) => {
        tempArray.push({
          ID: item.ID,
          comment: item.comments,
          commentAuthor: item?.createdBy
            ? [
                {
                  id: item?.createdBy?.ID,
                  name: item?.createdBy?.Title,
                  email: item?.createdBy?.EMail,
                },
              ]
            : [],
          commentDateAndTime: item.Created,
          role: item.role,
          // isRejectedComment: item.isRejectedComment ? true : false,
        });
      });
      console.log(tempArray);
    })
    .catch((err) => console.log(err));
  dispatcher(setPromatedComments(tempArray));
};

const addSectionComment = async (
  jsonObject: any,
  sectionComments: any[],
  dispatcher: any,
  currentUser: any,
  setLoaderState: any,
  setToastState: any,
  sectionId: any,
  AllSectionsDataMain: any
): Promise<boolean> => {
  debugger;
  console.log(jsonObject, sectionId, AllSectionsDataMain);
  let clearInput: boolean = false;
  const tempArray: any[] = [...sectionComments];
  try {
    await SpServices.SPAddItem({
      Listname: LISTNAMES.SectionComments,
      RequestJSON: jsonObject,
    })
      .then((res: any) => {
        console.log(res);
        if (res.data.ID) {
          clearInput = true;
          tempArray.push({
            ID: res?.data?.ID,
            comment: jsonObject.comments,
            commentAuthor: currentUser
              ? [
                  {
                    id: currentUser?.id,
                    name: currentUser?.userName,
                    email: currentUser?.email,
                  },
                ]
              : [],
            commentDateAndTime: res?.data?.Created,
            role: jsonObject.role,
            isRejectedComment: res?.data?.isRejectedComment ? true : false,
          });

          //   setLoaderState({
          //     isLoading: {
          //       inprogress: false,
          //       success: true,
          //       error: false,
          //     },
          //     visibility: true,
          //     text: `Comment sended successfully!`,
          //     secondaryText: `Comment sended successfully`,
          //   });

          const updateArray = AllSectionsDataMain.map((obj: any) => {
            if (obj.ID === sectionId) {
              return { ...obj, commentsCount: obj.commentsCount + 1 };
            } else {
              return obj;
            }
          });

          dispatcher(setCDSectionData([...updateArray]));
          setToastState({
            isShow: true,
            severity: "success",
            title: "Comment Submittted",
            message: "Your comment added successfully",
            duration: 3000,
          });
        }
        dispatcher(setSectionComments(tempArray));
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
          text: "Unable to Send the comment.",
          secondaryText:
            "An unexpected error occurred while send the comment, please try again later.",
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
      text: "Unable to send the comment.",
      secondaryText:
        "An unexpected error occurred while send the comment, please try again later.",
    });
  }

  return clearInput;
};

export { getSectionComments, addSectionComment, getPromotedComments };
