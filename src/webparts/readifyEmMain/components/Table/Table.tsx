/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-debugger */
/* eslint-disable react/jsx-key */
/* eslint-disable @rushstack/no-new-null */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { memo, useState, useEffect } from "react";
import styles from "./Table.module.scss"; // Importing the SCSS module
import TableItem from "./TableItem";
import { TableItemLoading } from "./LoadingTemplates/TableItemLoading";
import { TableRowLoading } from "./LoadingTemplates/TableRowLoading";
// import { UpdateDocument } from "../../../../services/NewDocument/NewDocumentServices";
import AlertPopup from "../common/Popups/AlertPopup/AlertPopup";
import { IPopupLoaders } from "../../../../interface/MainInterface";
import { initialPopupLoaders, LISTNAMES } from "../../../../config/config";
import { OrderList } from "primereact/orderlist";
// import { updateFolderSequenceNumber } from "../../../../services/EMManual/EMMServices";
import { CurrentUserIsAdmin } from "../../../../constants/DefineUser";
import SpServices from "../../../../services/SPServices/SpServices";
import { updateFolderSequenceNumber } from "../../../../services/EMManual/EMMServices";

interface ITableProps {
  headers: string[];
  data: any[];
  loading: boolean;
  filters?: {
    searchTerm: string;
    filterByStatus?: string | null;
  };
  actions?: boolean;
  renderActions?: any;
  renderActionsForFolders?: any;
  defaultTable?: any;
  loadData?: any;
  columns?: any;
}

interface LibraryItem {
  name: string | any;
  url: string;
  fields: any;
  open: boolean; // Flag to indicate if the item is open or closed
  type: string;
  sequenceNo: string;
  items?: LibraryItem[] | undefined;
}

const Table: React.FC<ITableProps> = ({
  headers,
  data,
  loading,
  filters,
  actions,
  renderActions,
  renderActionsForFolders,
  defaultTable,
  loadData,
  columns,
}: ITableProps): JSX.Element => {
  const isAdmin: boolean = CurrentUserIsAdmin();

  const loaderTemplateData: any = defaultTable
    ? headers
    : [
        {
          name: "",
          url: "",
          fields: {
            name: "",
            status: "",
            nextReview: "",
            createdDate: "",
            isVisible: "",
            Action: "",
          },
          items: [
            {
              name: "",
            },
          ],
        },
      ];

  const [DNDData, setDNDData] = useState<LibraryItem[]>([]);
  console.log("DNDData: ", DNDData);

  const [popupLoaders, setPopupLoaders] =
    useState<IPopupLoaders>(initialPopupLoaders);

  // const handleData = async (newData: any, data: any): Promise<any> => {
  //   console.log("data: ", data);
  //   console.log("newData: ", newData);
  //   debugger;
  //   const reorderedItems = newData?.map((e: any, index: number) => {
  //     return {
  //       ID: e?.ID,
  //       sequenceNo: String(index + 1),
  //     };
  //   });
  //   const fileReorder = newData?.some((item: any) => item?.type === "file");
  //   if (fileReorder) {
  //     const reorderedItemsList = newData?.map((e: any, index: number) => {
  //       return {
  //         ID: e?.ID,
  //         sequenceNo: String(index + 1),
  //       };
  //     });
  //     const reorderedItemsLib = newData?.map((e: any, index: number) => {
  //       return {
  //         ID: e?.fileID,
  //         sequenceNo: String(index + 1),
  //       };
  //     });

  //     await SpServices.batchUpdate({
  //       ListName: LISTNAMES.AllDocuments,
  //       responseData: reorderedItemsLib,
  //     });

  //     await SpServices.batchUpdate({
  //       ListName: LISTNAMES.DocumentDetails,
  //       responseData: reorderedItemsList,
  //     });
  //   }

  //   reorderedItems?.forEach(async (el: any) => {
  //     if (el?.type === "folder") {
  //       await updateFolderSequenceNumber(el?.fileID, el?.sequenceNo);
  //     }
  //     // else {
  //     // await UpdateDocument(
  //     //   el,
  //     //   el?.fileID,
  //     //   setPopupLoaders,
  //     //   el?.ID,
  //     //   el?.isDraft,
  //     //   false,
  //     //   true
  //     // );
  //     // }
  //   });

  //   if (!fileReorder) {
  //     loadData();
  //   }
  // };

  const handleData = async (newData: any, data: any): Promise<void> => {
    try {
      console.log("data: ", data);
      console.log("newData: ", newData);
      debugger;

      const fileReorder = newData?.some((item: any) => item?.type === "file");

      console.log("fileReorder: ", fileReorder);
      if (fileReorder) {
        // Find the index of the item in DNDData that matches the fileID of the data
        const index = DNDData?.findIndex(
          (item: any) => item?.fileID === data?.fileID
        );

        if (index !== -1) {
          // Clone the existing DNDData to avoid mutating state directly
          const updatedData = [...DNDData];

          // Replace the item at the found index with the new data
          updatedData[index] = {
            ...updatedData[index],
            items: newData, // or directly newData if it should replace the items key
          };
          // Update the state directly with the new data
          setDNDData(updatedData);
        }
        // Reorder the items for both lists
        const reorderedItemsList = newData?.map((e: any, index: number) => ({
          ID: e?.ID,
          sequenceNo: String(index + 1),
        }));

        const reorderedItemsLib = newData?.map((e: any, index: number) => ({
          ID: e?.fileID,
          sequenceNo: String(index + 1),
        }));

        // Batch update the items in SharePoint lists
        await SpServices.batchUpdate({
          ListName: LISTNAMES.AllDocuments,
          responseData: reorderedItemsLib,
        });

        await SpServices.batchUpdate({
          ListName: LISTNAMES.DocumentDetails,
          responseData: reorderedItemsList,
        });
      } else {
        const reorderedItems = newData?.map((e: any, index: number) => ({
          ...e,
          sequenceNo: String(index + 1),
        }));

        reorderedItems?.forEach(async (el: any) => {
          if (el?.type === "folder") {
            await updateFolderSequenceNumber(el?.fileID, el?.sequenceNo);
          }
          // else {
          // await UpdateDocument(
          //   el,
          //   el?.fileID,
          //   setPopupLoaders,
          //   el?.ID,
          //   el?.isDraft,
          //   false,
          //   true
          // );
          // }
        });
        setDNDData(newData);
        // await loadData();
      }
    } catch (error) {
      console.error("Error handling data:", error);
    }
  };

  const togglePanel = (item: LibraryItem): void => {
    const updateItem = (currentItem: LibraryItem): LibraryItem => {
      if (currentItem.name === item.name) {
        return { ...currentItem, open: !currentItem.open };
      }

      if (currentItem.items) {
        return {
          ...currentItem,
          items: currentItem.items.map((childItem) => updateItem(childItem)),
        };
      }

      return currentItem;
    };

    const updatedDNDData: any = DNDData.map((prevItem) => updateItem(prevItem));
    setDNDData(updatedDNDData);
  };

  const filterData = (
    searchTerm: string,
    data: any[],
    filterByStatus: string | null
  ): LibraryItem[] => {
    const lowercasedSearchTerm = searchTerm?.toLowerCase();

    const matchesSearchTerm = (item: any): boolean => {
      if (defaultTable) {
        // For flat data
        return Object.values(item).some((value: any) =>
          value?.toString().toLowerCase().includes(lowercasedSearchTerm)
        );
      } else {
        // For hierarchical data
        return item.name?.toLowerCase().includes(lowercasedSearchTerm);
      }
    };

    const matchesStatus = (item: LibraryItem): boolean => {
      return (
        filterByStatus === null ||
        (item.type === "file" && item.fields?.status === filterByStatus)
      );
    };

    const filterRecursive = (items: LibraryItem[]): LibraryItem[] => {
      return items
        .map((item) => {
          const matchesSearch = matchesSearchTerm(item);
          const matchesStatusFilter = matchesStatus(item);

          let openItem = false;

          if (searchTerm && filterByStatus) {
            if (matchesSearch && matchesStatusFilter) {
              openItem = true;
            }
          } else if (searchTerm) {
            if (matchesSearch) {
              openItem = true;
            }
          } else if (filterByStatus) {
            if (matchesStatusFilter) {
              openItem = true;
            }
          }

          if (item.items) {
            const filteredChildren = filterRecursive(item.items);
            if (filteredChildren.length > 0) {
              return {
                ...item,
                items: filteredChildren,
                open: true,
              };
            }
          }

          if (openItem) {
            return { ...item, open: true };
          }

          return null;
        })
        .filter((item): item is LibraryItem => item !== null);
    };

    if (!searchTerm && !filterByStatus) {
      return data;
    }

    if (defaultTable) {
      // Filter for flat data
      return data.filter(matchesSearchTerm);
    } else {
      // Filter for hierarchical data
      return filterRecursive(data);
    }
  };

  const renderTableItem = (data: any): any => {
    return (
      <TableItem
        tableData={data}
        columns={columns}
        itemTemplateLoading={TableItemLoading}
        handleData={(value: any) => {
          handleData(value, data);
        }}
        loading={loading}
        togglePanel={togglePanel}
        actions={actions}
        defaultTable={defaultTable}
        renderActionsForFiles={renderActions}
        renderActionsForFolders={renderActionsForFolders}
      />
    );
  };

  useEffect(() => {
    setDNDData(
      loading
        ? loaderTemplateData
        : filterData(
            filters?.searchTerm || "",
            data,
            filters?.filterByStatus || null
          )
    );
  }, [data, loading]);

  useEffect(() => {
    if (!loading) {
      setDNDData(
        filterData(
          filters?.searchTerm || "",
          data,
          filters?.filterByStatus || null
        )
      );
    }
  }, [filters]);

  return (
    <div className={`${styles.tableWrapper} tableWrapper`}>
      <div className={styles.tableHeadersWrapper}>
        {headers?.map((el, i) => (
          <div
            key={i}
            className={`${styles.tableHeader} ${
              defaultTable ? styles.defaultTableHeader : ""
            }`}
          >
            <span>{el}</span>
          </div>
        ))}
        {actions && (
          <div className={styles.tableHeader}>
            <span>Action</span>
          </div>
        )}
      </div>

      {loading && !defaultTable ? (
        loaderTemplateData.map((data: any, i: number) => (
          <TableRowLoading
            key={i}
            item={i}
            togglePanel={() => {
              console.log("toggled");
            }}
            defaultTableLoader={false}
            activeIndex={0}
            data={data}
            itemLoadingTemplate={TableItemLoading}
          />
        ))
      ) : loading && defaultTable ? (
        <TableRowLoading
          key={1}
          item={1}
          togglePanel={() => {
            console.log("toggled");
          }}
          defaultTableLoader={true}
          activeIndex={0}
          data={headers}
          itemLoadingTemplate={TableItemLoading}
        />
      ) : DNDData.length && !defaultTable ? (
        // DNDData.map((data: any, i: number) => (
        <OrderList
          dataKey="id"
          value={DNDData}
          itemTemplate={(item: any) => renderTableItem(item)}
          onChange={(e) => {
            // console.log("e: ", e.value);
            handleData(e.value, DNDData);
          }}
          dragdrop={isAdmin}
          focusOnHover={false}
        />
      ) : // ))
      DNDData.length && defaultTable ? (
        DNDData.map((data: any, i: number) => (
          <TableItem
            tableData={data}
            itemTemplateLoading={TableItemLoading}
            handleData={handleData}
            columns={columns}
            loading={loading}
            togglePanel={togglePanel}
            key={i}
            actions={actions}
            defaultTable={defaultTable}
            renderActionsForFiles={renderActions}
            renderActionsForFolders={renderActionsForFolders}
          />
        ))
      ) : (
        <div className={styles.panelContainer}>
          {filters?.searchTerm && filters?.filterByStatus && (
            <span className={styles.errorMsg}>
              <p> "{filters.searchTerm}" </p> Not found in{" "}
              <p> "{filters.filterByStatus}" </p> status.
            </span>
          )}
          {filters?.searchTerm && !filters?.filterByStatus && (
            <span className={styles.errorMsg}>
              <p> "{filters.searchTerm}" </p> Not found!
            </span>
          )}
          {!filters?.searchTerm && filters?.filterByStatus && (
            <span className={styles.errorMsg}>
              No document found in <p> "{filters.filterByStatus}" </p> status.
            </span>
          )}
          {DNDData?.length === 0 &&
            !filters?.searchTerm &&
            !filters?.filterByStatus && (
              <span className={styles.errorMsg}> No data found.</span>
            )}
        </div>
      )}

      <AlertPopup
        secondaryText={popupLoaders.secondaryText}
        isLoading={popupLoaders?.isLoading}
        onClick={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        onHide={() => {
          setPopupLoaders(initialPopupLoaders);
        }}
        popupTitle={popupLoaders.text}
        visibility={popupLoaders.visibility}
        popupWidth={"30vw"}
        noActionBtn={true}
      />
    </div>
  );
};

export default memo(Table);
