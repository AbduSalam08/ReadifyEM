/* eslint-disable @typescript-eslint/no-explicit-any */
// exp 3 - latest stable code
import { memo, useEffect, useState } from "react";
import { OrderList } from "primereact/orderlist";
import arrowRightIcon from "../../../../assets/images/svg/arrowRight.svg";
import pdfIcon from "../../../../assets/images/svg/pdfIcon.svg";
import styles from "./Table.module.scss";
import StatusPill from "../StatusPill/StatusPill";
import { CurrentUserIsAdmin } from "../../../../constants/DefineUser";
import DueDatePill from "../common/DueDatePill/DueDatePill";

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
  itemTemplateLoading,
  handleData,
  loading,
  actions,
  renderActionsForFiles,
  renderActionsForFolders,
  defaultTable,
  columns,
}) => {
  const [data, setData] = useState(tableData);
  const [isOpen, setIsOpen] = useState(data.open);
  const isAdmin: boolean = CurrentUserIsAdmin();
  useEffect(() => {
    setIsOpen(data.open);
  }, [data?.open]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const itemTemplate = (item: any, paddingLeft?: any): JSX.Element => {
    return (
      <div
        className={styles.itemContainer}
        style={{
          paddingLeft: paddingLeft,
        }}
      >
        <div className={`${styles.item}`} title={item.name || "-"}>
          <img src={pdfIcon} alt={pdfIcon} />
          <span>{item.name}</span>
          {item.isDraft && <div className={styles.draftPill}>Draft</div>}
        </div>
        {Object.keys(item.fields).map((key: string, i: number) => {
          console.log("key: ", key);
          return key.toLowerCase() !== "status" ? (
            <div
              className={styles.item}
              title={item.fields[key] || "-"}
              key={i}
            >
              {item.fields[key] || "-"}
              {key?.toLowerCase() === "nextreviewdate" && !item.isDraft && (
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <DueDatePill
                    dueDate={item.fields[key]}
                    roles="Primary Author"
                    leftText={"D"}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              className={styles.item}
              title={item.fields[key] || "-"}
              key={i}
            >
              <StatusPill status={item.fields[key]} size="MD" key={i} />
            </div>
          );
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
                  // console.log("Files onChange:", e);
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
                  // console.log("Folders onChange:", e);
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
    setIsOpen((prev) => !prev);
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
                  width: "18%",
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
              value={data.items?.filter((item) => item.type === "file")}
              itemTemplate={(item: LibraryItem) =>
                renderItemsRecursively([item], 0)
              }
              onChange={(e) => {
                // console.log("e: ", e);
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
                // console.log("e: ", e);
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
