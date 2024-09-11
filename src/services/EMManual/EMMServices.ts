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
import {
  UpdatePrimaryAuthorTask,
  UpdateTask,
} from "../MyTasks/MyTasksServices";

export interface LibraryItem {
  ID?: number;
  fileIDFromList?: number;
  fileID?: number;
  name: string;
  url: string;
  fields: any;
  open: boolean;
  type: any;
  isDraft: boolean;
  sequenceNo: any;
  items?: LibraryItem[];
  version?: any;
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
      // removing FORMS default folder using its unique ID which is dont needed in out application
      if (subFolder?.UniqueId !== "b6160d32-57c4-47a4-922d-2a6c28fdc986") {
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
        .select("*,documentDetails/ID, documentDetails/Title,fileDetails/ID")
        .expand("documentDetails,fileDetails")
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

      // if its admin role render all files with all status else render only restricted items by its approved status
      if (fileFields?.ID === fileItemsFromList?.fileDetailsId) {
        folderItems.push({
          ID: fileItemsFromList?.ID,
          fileIDFromList: fileItemsFromList?.fileDetailsId,
          fileID: fileFields?.ID,
          name: file.Name,
          type: "file",
          url: file.ServerRelativeUrl,
          open: false,
          isDraft: fileItemsFromList?.isDraft,
          sequenceNo: fileItemsFromList?.sequenceNo,
          version: fileItemsFromList?.documentVersion,
          fields: {
            createdDate: fileItemsFromList?.createdDate,
            nextReviewDate: fileItemsFromList?.nextReviewDate,
            status: fileItemsFromList?.status,
            isVisible: fileFields?.isVisible,
          },
        });
      } else {
        folderItems.push({
          ID: fileItemsFromList?.ID,
          fileIDFromList: fileItemsFromList?.fileDetailsId,
          fileID: fileFields?.ID,
          name: file.Name,
          type: "file",
          url: file.ServerRelativeUrl,
          open: false,
          isDraft: fileFields?.isDraft,
          sequenceNo: fileFields?.sequenceNo,
          version: fileFields?.documentVersion,
          fields: {
            createdDate: fileFields?.createdDate,
            nextReviewDate: fileFields?.nextReviewDate,
            status: fileFields?.status,
            isVisible: fileFields?.isVisible,
          },
        });
      }
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

// filtering the data items by its doc status for non admin(user) role
const filterData = (
  data: LibraryItem[],
  filterByStatus: string | any
): LibraryItem[] => {
  const matchesStatus = (item: LibraryItem): boolean => {
    return (
      filterByStatus === null ||
      (item.type === "file" &&
        item?.fields.isVisible &&
        filterByStatus?.includes(item.fields?.status?.toLowerCase()))
    );
  };

  const filterRecursive = (items: LibraryItem[]): LibraryItem[] => {
    return items
      .map((item) => {
        if (item.items) {
          const filteredChildren = filterRecursive(item.items);
          if (filteredChildren.length > 0) {
            return {
              ...item,
              items: filteredChildren,
            };
          }
        }

        if (matchesStatus(item)) {
          return { ...item };
        }

        return null;
      })
      .filter((item): item is LibraryItem => item !== null);
  };

  return filterRecursive(data);
};

// A function that loads all the table data and render it in the given table state
export const LoadTableData = async (
  dispatch: Dispatch,
  setTableData: (data: any) => void,
  isAdmin: boolean
): Promise<void> => {
  try {
    setTableData((prevData: any) => ({ ...prevData, loading: true }));
    const { items, DocumentPathOptions } = await getLibraryItems();
    const AdminData: any[] = sortItemsBySequenceNo(items);
    const UsersData = sortItemsBySequenceNo(
      filterData(items, ["approved", "current"])
    );

    setTableData((prevData: any) => ({
      ...prevData,
      data: isAdmin ? AdminData : UsersData,
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

// fn used in changing a folder or group/subgroup and updating the value of its own at the same time simentensoly it updates the docs and tasks which contains the path of the folder or sub folder
export const EditFolderAndChangeItemPath = async (
  oldFolderPath: string,
  newFolderPath: string
): Promise<any> => {
  try {
    // Move the folder
    const oldFolder = sp.web.getFolderByServerRelativePath(oldFolderPath);
    await oldFolder.moveTo(newFolderPath);

    // Retrieve files inside the updated folder
    const newFolderFiles: any = await sp.web
      .getFolderByServerRelativePath(newFolderPath)
      .files.select("*, ListItemAllFields/ID")
      .expand("ListItemAllFields")
      .get();

    // Update each file's document path
    for (const file of newFolderFiles) {
      const itemId = file.ListItemAllFields.ID;
      const itemURL = file.ServerRelativeUrl?.split("/")
        ?.slice(0, -1)
        ?.join("/");

      const documentDetailsRes = await SpServices.SPReadItems({
        Listname: LISTNAMES.DocumentDetails,
        Filter: [
          {
            FilterKey: "fileDetailsId",
            Operator: "eq",
            FilterValue: itemId,
          },
        ],
      });

      if (documentDetailsRes.length > 0) {
        const documentId = documentDetailsRes[0].ID;
        await sp.web.lists
          .getByTitle(LISTNAMES.DocumentDetails)
          .items.getById(documentId)
          .update({ documentPath: itemURL });

        const myTasksRes = await SpServices.SPReadItems({
          Listname: LISTNAMES.MyTasks,
          Select: "*,documentDetails/ID",
          Expand: "documentDetails",
          Filter: [
            {
              FilterKey: "documentDetailsId",
              Operator: "eq",
              FilterValue: documentId,
            },
          ],
        });

        const hasPATask = myTasksRes.filter(
          (item: any) => item?.role?.toLowerCase() === "primary author"
        );

        if (hasPATask.length !== 0) {
          await UpdatePrimaryAuthorTask(documentId);
          await UpdateTask(documentId);
        } else {
        }
      }
    }

    return "true";
  } catch (error: any) {
    console.error("Error in editFolderAndChangeItemPath: ", error.message);
    return error;
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
