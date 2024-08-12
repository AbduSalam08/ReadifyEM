/* eslint-disable @typescript-eslint/no-explicit-any */
export const togglePopupVisibility = (
  setPopupController: any,
  index: number,
  action: "open" | "close",
  popupTitle?: any,
  popupData?: any
): void => {
  setPopupController((prev: any) =>
    prev.map((popup: any, popupIndex: any) =>
      popupIndex === index
        ? {
            ...popup,
            open: action === "open" ? true : false,
            popupTitle: popupTitle || popup.popupTitle,
            popupData: popupData || "",
          }
        : { ...popup }
    )
  );
};
