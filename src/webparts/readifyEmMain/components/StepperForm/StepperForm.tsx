/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./StepperForm.module.scss";
import StepperHeader from "./StepperHeader/StepperHeader";

interface Props {
  activeStep: any;
  stepperFormData: any;
  stepperInputs: any;
}

const StepperForm = ({
  activeStep,
  stepperFormData,
  stepperInputs,
}: Props): JSX.Element => {
  return (
    <div className={styles.stepperFormWrapper}>
      <div className={styles.stepperFormHeader}>
        <StepperHeader steps={stepperFormData} activeStep={activeStep} />
      </div>

      {stepperFormData?.map((data: any, i: number) => {
        return (
          <div
            key={i}
            className={`${styles.questionWrapper} ${
              activeStep === data.step - 1 ? styles.questionWrapperActive : ""
            }`}
          >
            <div className={styles.stepperFormBody}>
              <p className={styles.question}>
                {data.step}. {data.question}
              </p>
              <div className={styles.questionInputsWrapper}>
                {stepperInputs[i]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(StepperForm);
