/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";
import { Dispatch } from "redux";
import {
  setEMMTOCAdminData,
  setFoldersData,
} from "../../redux/features/EMMTableOfContents";
import SpServices from "../SPServices/SpServices";
import { LISTNAMES } from "../../config/config";

export interface LibraryItem {
  ID?: number;
  fileID?: number;
  name: string;
  url: string;
  fields: any;
  open: boolean;
  type: any;
  isDraft: boolean;
  sequenceNo: any;
  items?: LibraryItem[];
}

// function to get all items which is folder & files from Library and list
export const getLibraryItems = async (): Promise<{
  items: LibraryItem[];
  DocumentPathOptions: any[];
}> => {
  // fetch folders and files
  const fetchFoldersAndFiles = async (
    folderUrl: string
  ): Promise<LibraryItem[]> => {
    const folder: any = sp.web.getFolderByServerRelativePath(folderUrl);

    const [folders, files] = await Promise.all([
      folder.folders(),
      folder.files(),
    ]);

    const folderItems: LibraryItem[] = [];

    for (const subFolder of folders) {
      // removing FORMS defult folder using its unique ID which is dont needed in out application
      if (subFolder?.UniqueId !== "da7fc51c-8ee3-49b4-a6fd-0301e0533cc9") {
        const subFolderFields = await sp.web
          .getFolderByServerRelativePath(subFolder.ServerRelativeUrl)
          .listItemAllFields.get();
        const subFolderItems = await fetchFoldersAndFiles(
          subFolder.ServerRelativeUrl
        );

        folderItems.push({
          name: subFolder.Name,
          fileID: subFolderFields.ID,
          url: subFolder.ServerRelativeUrl,
          type: "folder",
          open: false,
          isDraft: subFolderFields.isDraft,
          sequenceNo: subFolderFields?.sequenceNo,
          fields: {
            createdDate: subFolderFields.createdDate,
            nextReviewDate: subFolderFields.nextReviewDate,
            status: subFolderFields.status,
            // isVisible: subFolderFields.isVisible,
          },
          items: subFolderItems,
        });
      }
    }

    // looping the files from the items
    for (const file of files) {
      const fileFields = await sp.web
        .getFileByServerRelativePath(file.ServerRelativeUrl)
        .select("documentDetails/ID, documentDetails/Title")
        .expand("documentDetails")
        .listItemAllFields.get();

      let fileItemsFromList: any;

      if (fileFields) {
        await SpServices.SPReadItemUsingId({
          Listname: LISTNAMES.DocumentDetails,
          SelectedId: fileFields?.documentDetailsId,
          Select:
            "*, primaryAuthor/Id, primaryAuthor/Title, primaryAuthor/EMail",
          Expand: "primaryAuthor",
        })
          .then((res: any) => {
            fileItemsFromList = res;
          })
          .catch((err: any) => {
            return err;
          });
      }

      folderItems.push({
        ID: fileItemsFromList?.ID,
        fileID: fileFields?.ID,
        name: file.Name,
        type: "file",
        url: file.ServerRelativeUrl,
        open: false,
        isDraft: fileItemsFromList?.isDraft,
        sequenceNo: fileItemsFromList?.sequenceNo,
        fields: {
          createdDate: fileItemsFromList?.createdDate,
          nextReviewDate: fileItemsFromList?.nextReviewDate,
          status: fileItemsFromList?.status,
        },
      });
    }

    return folderItems;
  };

  // Mapping the items recursively
  const filterLibraryItems = (items: any): any => {
    return items.reduce((filteredItems: any, currentItem: any) => {
      if (currentItem.type === "folder" && currentItem?.items) {
        const filteredChildren = filterLibraryItems(currentItem.items);
        filteredItems.push({
          key: currentItem.url,
          label: currentItem.name,
          data: currentItem.fields,
          children: filteredChildren,
        });
      }
      return filteredItems;
    }, []);
  };

  // recursive calls
  const items = await fetchFoldersAndFiles("AllDocuments");
  const DocumentPathOptions = filterLibraryItems(items);

  return { items, DocumentPathOptions };
};

// function to get all files recursively
export const getAllFilesList = (items: any): any => {
  return items.reduce((filteredItems: any, currentItem: any) => {
    // If the current item is a file, add it to the filtered items
    if (currentItem.type === "file") {
      filteredItems.push({
        key: currentItem.url,
        label: currentItem.name,
        data: currentItem.fields,
      });
    }

    // If the current item has children, recursively get the files from the children
    if (currentItem.items) {
      const filteredChildren = getAllFilesList(currentItem.items);
      filteredItems = filteredItems.concat(filteredChildren);
    }

    return filteredItems;
  }, []);
};

// The main sorting function to sort all the items based on the sequence number
const sortItemsBySequenceNo = (items: LibraryItem[]): LibraryItem[] => {
  // Separate files and folders
  const files = items?.filter((item) => item?.type === "file");
  const folders = items?.filter((item) => item?.type === "folder");

  // Sort files by sequenceNo
  files?.sort((a, b) => {
    const seqA = a?.sequenceNo ? parseInt(a.sequenceNo, 10) : Infinity;
    const seqB = b?.sequenceNo ? parseInt(b.sequenceNo, 10) : Infinity;
    return seqA - seqB;
  });

  // Recursively sort items within each folder
  const sortedFolders = folders?.map((folder) => {
    if (folder?.items && folder?.items.length > 0) {
      return {
        ...folder,
        items: sortItemsBySequenceNo(folder.items),
      };
    }
    return folder;
  });

  // Combine sorted files and folders
  return [...sortedFolders, ...files];
};

// A function that loads all the table data and render it in the given table state
export const LoadTableData = async (
  dispatch: Dispatch,
  setTableData: (data: any) => void
): Promise<void> => {
  try {
    setTableData((prevData: any) => ({ ...prevData, loading: true }));
    const { items, DocumentPathOptions } = await getLibraryItems();
    setTableData((prevData: any) => ({
      ...prevData,
      data: sortItemsBySequenceNo(items),
      loading: false,
    }));
    dispatch(setFoldersData(DocumentPathOptions));
    dispatch(setEMMTOCAdminData(sortItemsBySequenceNo(items)));
  } catch (error) {
    console.error("Error loading library items:", error);
    setTableData((prevData: any) => ({ ...prevData, loading: false }));
  }
};

// group creation & sub group creation
export const createFolder = async (folderPath: string): Promise<any> => {
  return await sp.web
    .getFolderByServerRelativePath("/sites/ReadifyEM/AllDocuments")
    .folders.addUsingPath(folderPath);
};
