/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useCallback } from "react";
import styles from "./Inputs.module.scss";
import { Calendar } from "primereact/calendar";
import * as dayjs from "dayjs";

interface DDateInputProps {
  label?: string;
  disabledInput?: boolean;
  fromDate?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  value: string;
  onChange: any;
  error?: boolean;
  errorMsg?: string;
  customClass?: string;
  size?: string;
  placeHolder?: string;
}

const DDateInput: React.FC<DDateInputProps> = ({
  label,
  disabledInput = false,
  fromDate,
  disablePast = false,
  disableFuture = false,
  placeHolder,
  value,
  onChange,
  error = false,
  errorMsg = "",
  customClass = "",
  size = "100%",
}) => {
  const getFormattedDate = (date: any | null): any => {
    if (date) {
      return dayjs(date).format("DD/MM/YYYY");
    }
    return "";
  };

  const handleChange = useCallback(
    (e: any) => {
      const formattedDate = getFormattedDate(e.value);
      onChange(formattedDate);
    },
    [onChange]
  );

  const defaultValue = value ? dayjs(value, "DD/MM/YYYY").toDate() : null;

  return (
    <div
      className={`${styles.d_input_container} ${customClass} ${
        disabledInput && styles.diabledField
      }`}
      style={{ width: `${size}` }}
    >
      <label>{label}</label>
      <div
        className={`${styles.d_datepicker_wrapper} ${
          error ? styles.error : ""
        }`}
      >
        <Calendar
          value={defaultValue}
          onChange={(data: any) => {
            handleChange(data);
          }}
          disabled={disabledInput}
          //   minDate={fromDate ? dayjs(fromDate).toDate() : undefined}
          showIcon
          monthNavigator
          yearNavigator
          yearRange="2000:2100"
          dateFormat="dd/mm/yy"
          showTime={false}
          placeholder={!defaultValue ? placeHolder : ""}
          className={`${styles.d_datepicker}`}
          style={{ width: "100%" }}
        />
      </div>
      {error && <p className={styles.errorMessage}>{errorMsg}</p>}
    </div>
  );
};

export default memo(DDateInput);
