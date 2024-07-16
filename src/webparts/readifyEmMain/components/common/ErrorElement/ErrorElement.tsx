// /* eslint-disable @typescript-eslint/no-var-requires */
// import styles from "./ErrorElement.module.scss";
// const errorImg = require("../../../../../assets/images/svg/errorImg.svg");

// // local Interface
// interface IProps {
//   headerText?: string;
//   secondaryText?: string;
// }

// const ErrorElement = ({ headerText, secondaryText }: IProps): JSX.Element => {
//   return (
//     <div className={styles.errorElementWrapper}>
//       <div className={styles.content}>
//         <img src={errorImg} alt="error img exclamation" />
//         <p>{headerText ? headerText : "Something went wrong!"}</p>
//         <span>
//           {secondaryText
//             ? secondaryText
//             : "The page you have looking for is not found."}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default ErrorElement;
/* eslint-disable @typescript-eslint/no-var-requires */
import styles from "./ErrorElement.module.scss";
const errorImg = require("../../../../../assets/images/svg/errorImg.svg");

const ErrorElement = (): JSX.Element => {
  return (
    <div className={styles.errorElementWrapper}>
      <div className={styles.content}>
        <img src={errorImg} alt="error img exclamation" />
        <p>Something went wrong!</p>
        <span>The page you have looking for is not found.</span>
      </div>
    </div>
  );
};

export default ErrorElement;
