import { CircularProgress } from "@mui/material";
// styles
import styles from "./AppLoader.module.scss";
const CircularSpinner = (): JSX.Element => {
  return (
    <div className={`${styles.flexcenter} ${styles.loaderSection}`}>
      <CircularProgress
        sx={{
          width: "40px",
          height: "40px",
          animationDuration: "450ms",
          color: "#adadad",
        }}
        size={"30px"}
        disableShrink
        variant="indeterminate"
        color="inherit"
      />
    </div>
  );
};

export default CircularSpinner;
