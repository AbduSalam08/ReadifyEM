/* eslint-disable @typescript-eslint/no-explicit-any */
// COMMON
interface IPopupLoaders {
  secondaryText: string;
  visibility: boolean;
  isLoading: {
    inprogres: boolean;
    success: boolean;
    error: boolean;
  };
  text: string;
}

// NEW DOCUMENT
// formdata item
interface IFormDataItem {
  key: string;
  value: any;
  isValid?: boolean;
  errorMsg?: string;
}
// form data step
interface IStepData {
  step: number;
  question: string;
  completed: boolean;
}

interface actionBtns {
  btnType: string;
  text: any;
  onClick?: any;
  endIcon?: any;
  startIcon?: any;
  disabled?: boolean;
}

export { IPopupLoaders, IFormDataItem, IStepData, actionBtns };
