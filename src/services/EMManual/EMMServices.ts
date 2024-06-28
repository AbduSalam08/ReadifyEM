/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sp } from "@pnp/sp/presets/all";
import { Dispatch } from "redux";
import {
  setEMMTOCAdminData,
  setFoldersData,
} from "../../redux/features/EMMTableOfContentSlice";
import SpServices from "../SPServices/SpServices";
import { LIBNAMES, LISTNAMES } from "../../config/config";

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
    const folder: any = sp?.web?.getFolderByServerRelativePath(folderUrl);

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

  // Helper function to parse sequenceNo
  const parseSequenceNo = (item: LibraryItem) => {
    return item?.sequenceNo ? parseInt(item.sequenceNo, 10) : Infinity;
  };

  // Sort files by sequenceNo
  files?.sort((a, b) => parseSequenceNo(a) - parseSequenceNo(b));

  // Sort folders by sequenceNo
  folders?.sort((a, b) => parseSequenceNo(a) - parseSequenceNo(b));

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
  return [...files, ...sortedFolders];
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

// fn used to create a group / sub group / folder
export const createFolder = async (
  folderPath: string,
  sequenceNo?: any
): Promise<any> => {
  // Create the folder
  const folderCreation = await sp.web
    .getFolderByServerRelativePath("/sites/ReadifyEM/AllDocuments")
    .folders.addUsingPath(folderPath);

  // Update the folder's properties
  const folderItem: any = await sp.web
    .getFolderByServerRelativePath(folderCreation.data.ServerRelativeUrl)
    .select("ListItemAllFields/ID, ListItemAllFields/FileLeafRef")
    .expand("ListItemAllFields")
    .get();

  // Update sequenceNo if provided
  if (sequenceNo !== null || sequenceNo !== undefined) {
    await sp.web.lists
      .getByTitle("AllDocuments")
      .items.getById(folderItem.ListItemAllFields.ID)
      .update({
        sequenceNo: String(sequenceNo),
      });
  }

  return folderCreation;
};

// fn used in changing a folder or group/subgroup and updating the value of its own
export const EditFolderAndChangeItemPath = async (
  oldFolderPath: string,
  newFolderPath: string
): Promise<any> => {
  try {
    // Move the folder
    const oldFolder = sp.web.getFolderByServerRelativePath(oldFolderPath);
    await oldFolder.moveTo(newFolderPath);

    // Retrieve files inside the updated folder
    const newFolderFiles = await sp.web
      .getFolderByServerRelativePath(newFolderPath)
      .files.select("*, ListItemAllFields/ID")
      .expand("ListItemAllFields")
      .get();

    // Prepare batch for list item updates
    const batch = sp.web.createBatch();

    newFolderFiles.forEach((file: any) => {
      const itemId = file.ListItemAllFields.ID;
      const itemURL = file.ServerRelativeUrl?.split("/")
        ?.slice(0, -1)
        ?.join("/");

      SpServices.SPReadItems({
        Listname: LISTNAMES.DocumentDetails,
        Filter: [
          {
            FilterKey: "fileDetailsId",
            Operator: "eq",
            FilterValue: itemId,
          },
        ],
      })
        .then(async (res: any) => {
          if (res.length > 0) {
            await sp.web.lists
              .getByTitle(LISTNAMES.DocumentDetails)
              .items.getById(res[0].ID)
              .inBatch(batch)
              .update({
                documentPath: itemURL,
              });
          }
        })
        .catch((err: any) => {
          console.log("Error fetching items: ", err);
        });
    });

    await batch.execute();

    return true;
  } catch (error: any) {
    console.error("Error in editFolderAndChangeItemPath: ", error.message);
    return false;
  }
};

// fn for updating the folder's sequence number in reordering scenerio AKA drag & drop
export const updateFolderSequenceNumber = async (
  folderID: any,
  sequenceNo: any
): Promise<boolean> => {
  try {
    // Get the folder by its server relative path

    await sp.web.lists
      .getByTitle(LIBNAMES.AllDocuments)
      .items.getById(folderID)
      .update({
        sequenceNo: sequenceNo?.toString(),
      });

    return true;
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
    return false;
  }
};
