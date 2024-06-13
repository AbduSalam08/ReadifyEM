/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import styles from "./RadioGroup.module.scss";

interface Props {
  radioOptions: any[];
  onChange: any;
  isValid?: any;
  errorMsg?: string;
  selectedValue?: any;
}

const CustomRadioGroup = ({
  radioOptions,
  onChange,
  isValid,
  selectedValue,
  errorMsg,
}: Props): JSX.Element => {
  return (
    <>
      <div className={styles.radioGroupWrapper}>
        <RadioGroup
          name="radio-buttons-group"
          onChange={(e: any) => {
            onChange(e?.target?.value);
          }}
          value={selectedValue}
        >
          {radioOptions?.map((e: any, idx: number) => {
            return (
              <FormControlLabel
                key={idx}
                className={`radioText ${styles.radioText}`}
                value={e?.value}
                control={<Radio />}
                label={e?.label}
              />
            );
          })}
        </RadioGroup>
      </div>
      <p className={isValid ? styles.errorMsg : ""}>{isValid && errorMsg}</p>
    </>
  );
};

export default CustomRadioGroup;
