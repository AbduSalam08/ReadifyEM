/* eslint-disable @typescript-eslint/no-explicit-any */
// TableItem.tsx

import { OrderList } from "primereact/orderlist";
import arrowRightIcon from "../../../../assets/images/svg/arrowRight.svg";
import pdfIcon from "../../../../assets/images/svg/pdfIcon.svg";
import styles from "./Table.module.scss";
import { memo } from "react";

interface TableItemProps {
  data: any;
  activeIndex: boolean;
  togglePanel: (index: number, child?: boolean) => void;
  itemTemplateLoading: any;
  handleData: any;
  loading: boolean;
  childActiveIndex: number;
  setDragType: any;
  index: number;
}

const TableItem: React.FC<TableItemProps> = ({
  data,
  activeIndex,
  togglePanel,
  childActiveIndex,
  itemTemplateLoading,
  handleData,
  loading,
  setDragType,
  index,
}) => {
  // A function that returns the template of the table row coloum data in a view
  const itemTemplate = (item: any): JSX.Element => {
    console.log("item: ", item);
    return (
      <div className={styles.itemContainer}>
        <div className={styles.item} title={item?.DocumentName || "-"}>
          <img src={pdfIcon} alt={pdfIcon} />
          <span>{item?.DocumentName}</span>
        </div>
        {Object.values(item).map(
          (e: any, i) =>
            i >= 1 && (
              <div className={styles.item} title={e || "-"} key={i}>
                {e || "-"}
              </div>
            )
        )}
      </div>
    );
  };

  return (
    <div className={styles.accordionItem} key={index}>
      <div
        className={`${styles.panelContainer} ${
          activeIndex ? styles.panelActive : styles.panelInactive
        }`}
        onClick={() => togglePanel(index)}
      >
        <div
          className={`${
            activeIndex ? styles.panelIconActive : styles.panelIcon
          }`}
        >
          <img src={arrowRightIcon} alt="arrowRightIcon" />
        </div>
        <div className={styles.panelText}>{data.DOCName}</div>
      </div>

      <div
        className={`${styles.panelChild} ${activeIndex ? styles.active : ""}`}
      >
        <OrderList
          dataKey="Parent"
          value={data.Children}
          itemTemplate={loading ? itemTemplateLoading : itemTemplate}
          onChange={(e) => handleData(e.value, "parent", index, -1)}
          dragdrop
          onDrag={() => setDragType("parent")}
        />

        {data?.ChildAcc?.map((acc: any, childIndex: number) => (
          <div key={childIndex}>
            <div
              className={`${styles.panelContainerChild} ${
                childActiveIndex === childIndex
                  ? styles.panelActiveChild
                  : styles.panelInactive
              }`}
              onClick={() => togglePanel(childIndex, true)}
            >
              <div
                className={
                  childActiveIndex === childIndex
                    ? styles.panelIconActive
                    : styles.panelIcon
                }
              >
                <img src={arrowRightIcon} alt="arrowRightIcon" />
              </div>
              <div className={styles.panelText}>{acc.ChildDOC}</div>
            </div>

            <div
              // className={styles.panelChild}
              className={`${styles.panelChild} ${
                childActiveIndex === childIndex ? styles.active : ""
              }`}
            >
              <OrderList
                dataKey={`Child_${index}_${childIndex}`}
                value={acc.ChildArr}
                itemTemplate={itemTemplate}
                onChange={(e) =>
                  handleData(e.value, "child", index, childIndex)
                }
                dragdrop
                onDrag={() => setDragType("child")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TableItem);
