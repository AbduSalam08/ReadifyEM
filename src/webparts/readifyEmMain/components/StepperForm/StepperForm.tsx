/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import styles from "./StepperForm.module.scss";
import StepperHeader from "./StepperHeader/StepperHeader";
import { Message } from "primereact/message";

interface Props {
  activeStep: any;
  stepperFormData: any;
  stepperInputs: any;
  updateForm: boolean;
  pageProperties: any;
}

const StepperForm = ({
  activeStep,
  stepperFormData,
  stepperInputs,
  updateForm,
  pageProperties,
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
                {
                  <div className={styles.answerInputSpace}>
                    {stepperInputs[i]}
                    {activeStep === 1 && updateForm && (
                      <Message
                        className="stepperWarning"
                        severity="warn"
                        text={
                          <>
                            <span
                              style={{
                                fontFamily: "interMedium",
                                paddingRight: "5px",
                                fontSize: "14px",
                              }}
                            >
                              Warning :
                            </span>
                            <span
                              style={{
                                lineHeight: "18px",
                                fontSize: "14px",
                              }}
                            >
                              Changing the document type will result in the loss
                              of content created by the authors.
                            </span>
                          </>
                        }
                      />
                    )}
                  </div>
                }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(StepperForm);
