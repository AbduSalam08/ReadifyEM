/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkDuplicatesForSDD = (data: any[]): boolean => {
  const allSections = [...data];

  const valuesCount = allSections?.reduce(
    (acc: Record<string, number>, section: any) => {
      if (!section?.removed) {
        if (section && section.sectionName.value) {
          const valueKey = section?.sectionName?.value.trim().toLowerCase();
          acc[valueKey] = (acc[valueKey] || 0) + 1;
        }
      }
      return acc;
    },
    {}
  );

  return Object?.values(valuesCount)?.some((count: number) => count > 1);
};
