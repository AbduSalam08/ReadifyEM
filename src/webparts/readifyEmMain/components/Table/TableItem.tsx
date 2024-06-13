/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from "react";
import { OrderList } from "primereact/orderlist";
import arrowRightIcon from "../../../../assets/images/svg/arrowRight.svg";
import pdfIcon from "../../../../assets/images/svg/pdfIcon.svg";
import styles from "./Table.module.scss";
import StatusPill from "../StatusPill/StatusPill";

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
  renderActions?: any;
  defaultTable?: boolean;
}

const TableItem: React.FC<TableItemProps> = ({
  tableData,
  togglePanel,
  itemTemplateLoading,
  handleData,
  loading,
  actions,
  renderActions,
  defaultTable,
}) => {
  const [data, setData] = useState(tableData);

  const [isOpen, setIsOpen] = useState(data.open);

  useEffect(() => {
    setIsOpen(data.open);
  }, [data?.open]);

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  // A function that returns the template of the table row column data in a view
  const itemTemplate = (item: any): JSX.Element => {
    return (
      <div className={styles.itemContainer}>
        <div className={styles.item} title={item.name || "-"}>
          <img src={pdfIcon} alt={pdfIcon} />
          <span>{item.name}</span>
          {item.isDraft && <div className={styles.draftPill}>Draft</div>}
        </div>
        {Object.keys(item.fields).map((key: string, i: number) => {
          return key.toLowerCase() !== "status" ? (
            <div
              className={styles.item}
              title={item.fields[key] || "-"}
              key={i}
            >
              {item.fields[key] || "-"}
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
          <div className={styles.actionItem}>{renderActions(item)}</div>
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
        {Object.keys(item).map((key: string, i: number) => {
          return (
            key.toLowerCase() !== "id" && (
              <div className={styles.item} title={item[key] || "-"} key={i}>
                {item[key] || "-"}
              </div>
            )
          );
        })}
        {actions && (
          <div className={styles.actionItem}>{renderActions(item)}</div>
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

    return items?.map((item: LibraryItem, childIndex: number) => {
      const isChildOpen: boolean = item.open;

      return (
        <div key={childIndex}>
          {item.type === "folder" && (
            <>
              <div
                className={`${styles.panelContainerChild} ${
                  isChildOpen ? styles.panelActiveChild : styles.panelInactive
                }`}
                onClick={() => togglePanel(item)}
                style={{
                  paddingLeft: `${paddingLeft}px`,
                }}
              >
                <div
                  className={
                    isChildOpen ? styles.panelIconActive : styles.panelIcon
                  }
                >
                  {item.items && item.items.length > 0 && (
                    <img src={arrowRightIcon} alt="arrowRightIcon" />
                  )}
                </div>

                <div className={styles.panelText}>{item.name}</div>
                {item.items?.length === 0 && (
                  <span className={styles.emptyPill}>Empty Group</span>
                )}
              </div>

              <div
                className={`${styles.panelChild} ${
                  isChildOpen ? styles.active : ""
                }`}
              >
                <div
                  style={{
                    background: "#fff",
                    paddingLeft: `${paddingLeft - 42}px`,
                    borderBottom: "1px solid #00000010",
                  }}
                >
                  <OrderList
                    dataKey={`Child_${item.name}`}
                    value={item.items?.filter((el) => el.type === "file")}
                    itemTemplate={(item: any) => itemTemplate(item)}
                    onChange={(e) => handleData(e.value)}
                    dragdrop
                  />
                </div>
                {renderItemsRecursively(item.items, level + 1)}
              </div>
            </>
          )}
        </div>
      );
    });
  };

  const files = data.items?.filter((el) => el?.type === "file");

  // Custom toggle function to toggle the accordion panel
  const handleTogglePanel = (): void => {
    setIsOpen((prev) => !prev);
    togglePanel(data);
  };

  return (
    <>
      {!defaultTable ? (
        <div className={styles.accordionItem}>
          <div
            className={`${styles.panelContainer} ${
              isOpen ? styles.panelActive : styles.panelInactive
            }`}
            onClick={handleTogglePanel}
          >
            <div
              className={`${
                isOpen ? styles.panelIconActive : styles.panelIcon
              }`}
            >
              {data.items && data.items.length > 0 && (
                <img src={arrowRightIcon} alt="arrowRightIcon" />
              )}
            </div>
            <div className={styles.panelText}>{data.name}</div>
            {data.items?.length === 0 && (
              <span className={styles.emptyPill}>Empty Group</span>
            )}
          </div>

          <div
            className={`${styles.panelChild} ${isOpen ? styles.active : ""}`}
          >
            <OrderList
              dataKey="Parent"
              value={files}
              itemTemplate={
                loading
                  ? itemTemplateLoading
                  : defaultTable
                  ? itemTemplateForDefaultTable
                  : itemTemplate
              }
              onChange={(e) => {
                handleData(e.value);
              }}
              dragdrop
            />
            {renderItemsRecursively(data.items, 1)}
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
