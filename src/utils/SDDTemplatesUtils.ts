/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkDuplicates = (data: any[]): boolean => {
  const allSections = [...data];

  const valuesCount = allSections.reduce(
    (acc: Record<string, number>, section: any) => {
      if (!section.removed) {
        if (section && section.value) {
          const valueKey = section.value.trim().toLowerCase();
          acc[valueKey] = (acc[valueKey] || 0) + 1;
        }
      }
      return acc;
    },
    {}
  );

  return Object?.values(valuesCount)?.some((count: number) => count > 1);
};

// A simple function to filter the template by its name
export const filterTemplateByName = (templateName: string, data?: any): any => {
  return data?.filter((item: any) => {
    return item?.templateName === templateName;
  });
};
