/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import styles from "./RadioGroup.module.scss";

interface Props {
  radioOptions: any[];
  selectedValue: any;
  isValid?: any;
  errorMsg?: string;
}

const CustomRadioGroup = ({
  radioOptions,
  selectedValue,
  isValid,
  errorMsg,
}: Props): JSX.Element => {
  return (
    <>
      <div className={styles.radioGroupWrapper}>
        <RadioGroup
          name="radio-buttons-group"
          onChange={(e: any) => {
            selectedValue(e?.target?.value);
          }}
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
