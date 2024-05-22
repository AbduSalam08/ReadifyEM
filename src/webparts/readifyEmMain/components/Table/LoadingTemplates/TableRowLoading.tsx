/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "primereact/skeleton";
import arrowRightIcon from "../../../../../assets/images/svg/arrowRight.svg";
import styles from "../Table.module.scss";
import { OrderList } from "primereact/orderlist";

interface LoadingTemplateProps {
  togglePanel: (index: number) => void;
  item: number;
  activeIndex: number;
  data: any;
  itemLoadingTemplate: any;
}

const TableRowLoading = ({
  togglePanel,
  item,
  activeIndex,
  itemLoadingTemplate,
  data,
}: LoadingTemplateProps): JSX.Element => {
  const isActive = activeIndex === item;

  return (
    <div className={styles.accordionItem}>
      <div
        className={`${styles.panelContainer} ${
          isActive ? styles.panelActive : styles.panelInactive
        }`}
        onClick={() => togglePanel(item)}
      >
        <div
          className={`${styles.panelIcon} ${
            isActive ? styles.panelIconActive : styles.panelIcon
          }`}
        >
          <img src={arrowRightIcon} alt="arrowRightIcon" />
        </div>
        <div className={styles.panelText}>
          <Skeleton width="15rem" animation="wave" />
        </div>
      </div>

      <div className={`${styles.panelChild} ${isActive && styles.active}`}>
        <OrderList
          dataKey="Parent"
          value={data.Children}
          itemTemplate={itemLoadingTemplate}
          dragdrop
        />
      </div>
    </div>
  );
};

export { TableRowLoading };
