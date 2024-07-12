/* eslint-disable @typescript-eslint/no-explicit-any */
import { Skeleton } from "primereact/skeleton";
import styles from "../Table.module.scss";
import { OrderList } from "primereact/orderlist";
import arrowRightIcon from "../../../../../assets/images/svg/arrowRight.svg";
import { CurrentUserIsAdmin } from "../../../../../constants/DefineUser";

interface LoadingTemplateProps {
  togglePanel: (index: number) => void;
  item: number;
  activeIndex: number;
  data: any;
  itemLoadingTemplate: any;
  defaultTableLoader?: boolean;
}

const TableRowLoading = ({
  togglePanel,
  item,
  activeIndex,
  itemLoadingTemplate,
  data,
  defaultTableLoader,
}: LoadingTemplateProps): JSX.Element => {
  const isActive = activeIndex === item;
  const isAdmin: boolean = CurrentUserIsAdmin();
  if (defaultTableLoader) {
    // Default table loader: Render skeleton loaders in a row
    return (
      <div className={styles.defaultLoader}>
        {data?.map((key: any, index: number) => (
          <div key={index} className={styles.accordionItem}>
            <Skeleton width="100%" animation="wave" />
          </div>
        ))}
        {
          <div key={"lastitem"} className={styles.accordionItem}>
            <Skeleton width="100%" animation="wave" />
          </div>
        }
      </div>
    );
  } else {
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
            dataKey="name"
            value={data.items}
            itemTemplate={itemLoadingTemplate}
            dragdrop={isAdmin}
          />
        </div>
      </div>
    );
  }
};
export { TableRowLoading };
