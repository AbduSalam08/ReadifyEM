/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
// exp 3 - latest stable code
import { memo, useEffect, useState } from "react";
import { OrderList } from "primereact/orderlist";
import arrowRightIcon from "../../../../assets/images/svg/arrowRight.svg";
import pdfIcon from "../../../../assets/images/svg/pdfIcon.svg";
import styles from "./Table.module.scss";
import StatusPill from "../StatusPill/StatusPill";
import { CurrentUserIsAdmin } from "../../../../constants/DefineUser";
import DueDatePill from "../common/DueDatePill/DueDatePill";
import { formatDocNameWithLastVersion } from "../../../../utils/formatDocName";
import { InputSwitch } from "primereact/inputswitch";
import SpServices from "../../../../services/SPServices/SpServices";
import { LISTNAMES } from "../../../../config/config";
import { trimStartEnd } from "../../../../utils/validations";
import { statusLabel } from "../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import { useDispatch } from "react-redux";
import { setTableOfContentData } from "../../../../redux/features/EMMTableOfContentSlice";

interface LibraryItem {
  name: string;
  url: string;
  fields: any;
  open: boolean;
  type: string;
  items?: LibraryItem[];
}

interface TableItemProps {
  tableData: LibraryItem;
  togglePanel: any;
  setDNDData: any;
  tempTableData: any;
  itemTemplateLoading: any;
  handleData: any;
  loading: boolean;
  actions?: boolean;
  renderActionsForFiles?: any;
  renderActionsForFolders?: any;
  defaultTable?: boolean;
  columns?: any;
}

const TableItem: React.FC<TableItemProps> = ({
  tableData,
  togglePanel,
  setDNDData,
  tempTableData,
  itemTemplateLoading,
  handleData,
  loading,
  actions,
  renderActionsForFiles,
  renderActionsForFolders,
  defaultTable,
  columns,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(tableData);
  const [isOpen, setIsOpen] = useState(data.open);
  // const [toggleStates, setToggleStates] = useState<Record<number, boolean>>({});

  const isAdmin: boolean = CurrentUserIsAdmin();

  useEffect(() => {
    setIsOpen(data.open);
  }, [data?.open]);

  // useEffect(() => {
  //   const initialStates: Record<number, boolean> = {};
  //   data.items?.forEach((item: any) => {
  //     initialStates[item?.fileID] = item.fields?.isVisible;
  //   });
  //   setToggleStates(initialStates);
  // }, []);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const itemTemplate = (item: any, paddingLeft?: any): JSX.Element => {
    const lastUnderscoreIndex = item.name?.lastIndexOf("_");
    const lastDotIndex = item.name?.lastIndexOf(".");
    const version =
      lastUnderscoreIndex !== -1
        ? item.name?.substring(lastUnderscoreIndex + 1, lastDotIndex)
        : "1.0";

    return (
      <div
        className={styles.itemContainer}
        style={{
          paddingLeft: paddingLeft,
        }}
      >
        <div className={`${styles.item}`} title={item.name || "-"}>
          <img src={pdfIcon} alt={pdfIcon} />
          <span style={{ lineHeight: "30px" }}>
            {formatDocNameWithLastVersion(item.name, item?.version, true)}
          </span>
          <span
            style={{
              padding: "0 7px",
              height: "20px",
              fontFamily: "interSemiBold, sans-serif",
              borderRadius: "4px",
              backgroundColor: "#6536F9",
              color: "#f7f7f7",
              fontSize: "13px",
              display: "grid",
              placeItems: "center",
              marginLeft: "5px",
            }}
          >
            v{item?.version || version}
          </span>
          {item.isDraft && <div className={styles.draftPill}>Draft</div>}
        </div>

        {Object.keys(item.fields).map((key: string, i: number) => {
          const lowerCaseKey = key?.toLowerCase();
          // const fieldValue = item.fields[key] || "-";
          const fieldValue =
            (item?.fields["status"]?.toLowerCase() === "archived" &&
            key === "nextReviewDate"
              ? "-"
              : item.fields[key]) || "-";

          if (lowerCaseKey === "status") {
            return (
              <div className={styles.item} title={fieldValue} key={i}>
                {item.fields?.isVisible ? (
                  <StatusPill
                    status={
                      // item.fields.status?.toLowerCase() === "approved" ||
                      // item.fields.status?.toLowerCase() === "current"&&
                      //    item.fields.isVisible?
                      item.fields.status
                      // : "Hidden"
                    }
                    size="MD"
                  />
                ) : item.fields.status?.toLowerCase() === "approved" ? (
                  <StatusPill status={"Hidden"} size="MD" />
                ) : (
                  <StatusPill
                    status={
                      // item.fields.status?.toLowerCase() === "approved" ||
                      // item.fields.status?.toLowerCase() === "current"&&
                      //    item.fields.isVisible?
                      item.fields.status
                      // : "Hidden"
                    }
                    size="MD"
                  />
                )}
              </div>
            );
          }

          if (lowerCaseKey === "isvisible" && isAdmin) {
            return (
              <div className={styles.item} title={fieldValue} key={i}>
                {(item.fields.status?.toLowerCase() === "approved" ||
                  item.fields.status?.toLowerCase() === "current") && (
                  // <InputSwitch
                  //   // checked={item.fields[key]}
                  //   checked={isToggled}
                  //   className="sectionToggler"
                  //   disabled={
                  //     item.fields.status?.toLowerCase() !== "approved" &&
                  //     item.fields.status?.toLowerCase() !== "current"
                  //   }
                  //   onChange={async (e) => {
                  //     setIsToggled((prev: any) => !prev);

                  //     await SpServices.SPUpdateItem({
                  //       Listname: LISTNAMES.AllDocuments,
                  //       ID: item.fileID,
                  //       RequestJSON: {
                  //         isVisible: !item.fields.isVisible,
                  //       },
                  //     });
                  //     // Update the local state to reflect the visibility change
                  //     const currentItem = data.items?.find(
                  //       (el: any) => el?.fileID === item?.fileID
                  //     );

                  //     if (currentItem) {
                  //       setData((prev: any) => ({
                  //         ...prev,
                  //         items: prev.items.map((el: any) =>
                  //           el.fileID === item.fileID
                  //             ? {
                  //                 ...el,
                  //                 fields: {
                  //                   ...el.fields,
                  //                   isVisible: !el.fields.isVisible,
                  //                 },
                  //               }
                  //             : el
                  //         ),
                  //       }));
                  //     }
                  //   }}
                  //   key={i}
                  // />
                  <InputSwitch
                    checked={item.fields?.isVisible}
                    className="sectionToggler"
                    disabled={item.fields.status?.toLowerCase() !== "approved"}
                    onChange={async (e) => {
                      // const newState = !toggleStates[item.fileID];
                      // setToggleStates((prev) => ({
                      //   ...prev,
                      //   [item.fileID]: newState,
                      // }));

                      await SpServices.SPUpdateItem({
                        Listname: LISTNAMES.AllDocuments,
                        ID: item.fileID,
                        RequestJSON: {
                          isVisible: e.value,
                        },
                      });

                      setData((prev: any) => ({
                        ...prev,
                        items: prev.items.map((el: any) =>
                          el.fileID === item.fileID
                            ? {
                                ...el,
                                fields: {
                                  ...el.fields,
                                  isVisible: e.value,
                                },
                              }
                            : el
                        ),
                      }));
                      setDNDData((prevDNDData: any) =>
                        prevDNDData.map((prevItem: any) => {
                          if (prevItem.name === data.name) {
                            return {
                              ...prevItem,
                              items: prevItem?.items.map((el: any) =>
                                el.fileID === item.fileID
                                  ? {
                                      ...el,
                                      fields: {
                                        ...el.fields,
                                        isVisible: e.value,
                                      },
                                    }
                                  : el
                              ),
                            };
                          } else {
                            return prevItem;
                          }
                        })
                      );
                      const modifiedTableData = tempTableData?.data.map(
                        (prevItem: any) => {
                          if (prevItem.name === data.name) {
                            return {
                              ...prevItem,
                              open: true,
                              items: prevItem?.items.map((el: any) =>
                                el.fileID === item.fileID
                                  ? {
                                      ...el,
                                      fields: {
                                        ...el.fields,
                                        isVisible: e.value,
                                      },
                                    }
                                  : el
                              ),
                            };
                          } else {
                            return prevItem;
                          }
                        }
                      );
                      dispatch(
                        setTableOfContentData({
                          headers: tempTableData?.headers,
                          data: modifiedTableData,
                          loading: tempTableData?.loading,
                        })
                      );
                    }}
                    key={i}
                  />
                )}
              </div>
            );
          }

          if (lowerCaseKey !== "status" && lowerCaseKey !== "isvisible") {
            return (
              <div className={styles.item} title={fieldValue} key={i}>
                {!item.fields[key]
                  ?.toLowerCase()
                  ?.includes("awaiting approval") && fieldValue}
                {lowerCaseKey === "nextreviewdate" && !item.isDraft && (
                  <div>
                    {item.fields[key] &&
                    !item.fields[key]
                      ?.toLowerCase()
                      ?.includes("awaiting approval") &&
                    trimStartEnd(item.fields[key])?.trim() ? (
                      // item?.isPdfGenerated &&
                      item?.fields?.status?.toLowerCase() === "approved" ||
                      item?.fields?.status?.toLowerCase() ===
                        "archived" ? null : (
                        <DueDatePill
                          dueDate={item.fields[key]}
                          roles="Primary Author"
                          leftText={"D"}
                        />
                      )
                    ) : (
                      // <StatusPill
                      //   status="Hidden"
                      //   size="SM"
                      //   dynamicText={item.fields[key]}
                      // />
                      statusLabel(false, item.fields[key])
                    )}
                  </div>
                )}
              </div>
            );
          }

          // if (lowerCaseKey === "refid") {
          else {
            return (
              lowerCaseKey !== "isvisible" && (
                <div className={styles.item} title={fieldValue} key={i}>
                  {item.fields[key]}
                </div>
              )
            );
          }

          return null;
        })}

        {actions && (
          <div className={styles.actionItem}>{renderActionsForFiles(item)}</div>
        )}
      </div>
    );
  };

  const itemTemplateForDefaultTable = (item: any): JSX.Element => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {columns?.length === 0
          ? Object.keys(item).map((key: string, i: number) => {
              return (
                key.toLowerCase() !== "id" && (
                  <div className={styles.item} title={item[key] || "-"} key={i}>
                    {item[key] || "-"}
                  </div>
                )
              );
            })
          : Object.keys(item).map((key: string, i: number) => {
              return (
                columns?.includes(key) && (
                  <div className={styles.item} title={item[key] || "-"} key={i}>
                    <span>{item[key] || "-"}</span>
                  </div>
                )
              );
            })}
        {actions && (
          <div className={styles.actionItem}>{renderActionsForFiles(item)}</div>
        )}
      </div>
    );
  };

  const renderItemsRecursively = (
    items: LibraryItem[] | undefined,
    level: number
  ): JSX.Element[] => {
    if (!items) return [];

    const paddingLeft = 48 + level * 8;

    return items.map((item, childIndex) => {
      const isFolder = item.type === "folder";
      const isChildOpen: boolean = item.open;
      const folders = item.items?.filter(
        (subItem) => subItem.type === "folder"
      );
      const files = item.items?.filter((subItem) => subItem.type === "file");

      return (
        <div
          key={`${isFolder ? "folder" : "file"}-${childIndex}`}
          style={{
            width: "100%",
          }}
        >
          {isFolder ? (
            <div
              style={{
                width: "100%",
                background: "#fff",
                borderBottom: "1px solid #adadad20",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingLeft: `${paddingLeft - 34}px`,
              }}
            >
              <div
                className={`${styles.panelContainerChild} ${
                  isChildOpen ? styles.panelActiveChild : styles.panelInactive
                }`}
                onClick={() => togglePanel(item)}
              >
                {isFolder && item.items && item.items.length > 0 && (
                  <div
                    className={
                      isChildOpen ? styles.panelIconActive : styles.panelIcon
                    }
                  >
                    <img src={arrowRightIcon} alt="arrowRightIcon" />
                  </div>
                )}

                <div className={styles.panelText}>{item.name}</div>

                {item.items?.length === 0 && (
                  <span className={styles.emptyPill}>Empty Group</span>
                )}
              </div>
              {actions && isFolder && (
                <div
                  className={styles.actionItem}
                  style={{
                    width: "29%",
                    justifyContent: "center",
                  }}
                >
                  {renderActionsForFolders(item, "childFolder")}
                </div>
              )}
            </div>
          ) : (
            <div>{itemTemplate(item, paddingLeft - 14)}</div>
          )}

          {isChildOpen && isFolder && (
            <div
              className={`${styles.panelChild} ${
                isChildOpen ? styles.active : ""
              }`}
            >
              <OrderList
                dataKey={`ChildFiles_${item.name}`}
                value={files}
                itemTemplate={(file: LibraryItem) => (
                  <div>{itemTemplate(file, paddingLeft + 6)}</div>
                )}
                onChange={(e) => {
                  handleData(e.value);
                }}
                dragdrop={isAdmin}
                focusOnHover={false}
              />
              <OrderList
                dataKey={`ChildFolders_${item.name}`}
                value={folders}
                itemTemplate={(folder: LibraryItem) => (
                  <div>{renderItemsRecursively([folder], level + 1)}</div>
                )}
                onChange={(e) => {
                  handleData(e.value);
                }}
                dragdrop={isAdmin}
                focusOnHover={false}
              />
            </div>
          )}
        </div>
      );
    });
  };

  const handleTogglePanel = (): void => {
    setIsOpen((prev: any) => !prev);
    togglePanel(data);
  };

  const folders = data.items?.filter((item: any) => item?.type === "folder");

  return (
    <>
      {!defaultTable ? (
        <div className={styles.accordionItem} key={`${data?.name}_parent`}>
          <div
            key={`${data?.name}_parent`}
            style={{
              width: "100%",
              background: "#fff",
              borderBottom: "1px solid #adadad20",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              className={`${styles.panelContainer} ${
                isOpen ? styles.panelActive : styles.panelInactive
              }`}
              onClick={handleTogglePanel}
            >
              {data.items && data.items.length > 0 && (
                <div
                  className={`${
                    isOpen ? styles.panelIconActive : styles.panelIcon
                  }`}
                >
                  <img src={arrowRightIcon} alt="arrowRightIcon" />
                </div>
              )}
              <div className={styles.panelText}>{data.name}</div>
              {data.items?.length === 0 && (
                <span className={styles.emptyPill}>Empty Group</span>
              )}
            </div>

            {actions && (
              <div
                className={styles.actionItem}
                style={{
                  width: "12.5%",
                  justifyContent: "center",
                }}
              >
                {renderActionsForFolders(data, "parentFolder")}
              </div>
            )}
          </div>

          <div
            className={`${styles.panelChild} ${isOpen ? styles.active : ""}`}
          >
            <OrderList
              dataKey="Files"
              value={data.items?.filter((item: any) => item.type === "file")}
              itemTemplate={(item: LibraryItem) =>
                renderItemsRecursively([item], 0)
              }
              onChange={(e) => {
                handleData(e.value);
              }}
              dragdrop={isAdmin}
              focusOnHover={false}
            />

            <OrderList
              dataKey="Folders"
              value={folders}
              itemTemplate={(item: LibraryItem) =>
                renderItemsRecursively([item], 0)
              }
              onChange={(e) => {
                handleData(e.value);
              }}
              dragdrop={isAdmin}
              focusOnHover={false}
            />
          </div>
        </div>
      ) : (
        <div className={styles.defaultTableRow}>
          <div className={styles.panelContainer}>
            {itemTemplateForDefaultTable(data)}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(TableItem);
