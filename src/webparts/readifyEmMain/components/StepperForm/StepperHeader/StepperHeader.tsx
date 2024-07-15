/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./StepperHeader.module.scss";

interface Props {
  steps: any[];
  activeStep: number;
}

const StepperHeader = ({ steps, activeStep }: Props): JSX.Element => {
  return (
    <>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepsWrapper}>
          {index !== 0 && (
            <div className={styles.stepperLineWrapper}>
              <div
                className={`${styles.stepperLine} ${
                  step.step - 1 === activeStep ? styles.stepperLineActive : ""
                } ${step.completed ? styles.stepperLineCompleted : ""}`}
              />
            </div>
          )}
          <div
            className={`${styles.stepperText} ${
              step.step - 1 === activeStep ? styles.stepperTextActive : ""
            } ${step.completed ? styles.stepperTextCompleted : ""}`}
          >
            {step.step}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(StepperHeader);
