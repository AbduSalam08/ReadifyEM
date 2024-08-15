/* eslint-disable @typescript-eslint/no-explicit-any */
// A function that filter the TOC data by its url path
export const findItemByUrl = (items: any[], url: string): any => {
  for (const item of items) {
    if (item.url === url) {
      return item;
    }
    if (item.items && item.items.length > 0) {
      const found = findItemByUrl(item.items, url);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

// A function that filter the TOC data by its label / name
export const filterLibraryItemsByLabel = (
  items: any[],
  label: string
): any[] => {
  // Normalize the label by converting to lowercase
  const normalizedLabel = label?.toLowerCase();

  const filteredItems: any[] = [];

  const filterRecursive = (currentItems: any[]): void => {
    for (const currentItem of currentItems) {
      // Normalize the current item's label by converting to lowercase
      const normalizedCurrentLabel = currentItem.label?.toLowerCase();

      if (normalizedCurrentLabel.includes(normalizedLabel)) {
        if (currentItem.children) {
          const filteredChildren = filterLibraryItemsByLabel(
            currentItem.children,
            label
          );
          filteredItems.push({
            ...currentItem,
            children: filteredChildren,
          });
        } else {
          filteredItems.push(currentItem);
        }
      } else if (currentItem.children) {
        filterRecursive(currentItem.children);
      }
    }
  };

  filterRecursive(items);

  return filteredItems;
};

export const getParsedDocData = (data: string): any => {
  try {
    return JSON.parse(data)
      .sort((elem1: any, elem2: any) => elem1?.id - elem2?.id)
      .flatMap((item: any) => {
        return {
          ...item,
          userData: item?.userData?.[0] || item?.userData || [],
        };
      });
  } catch (error) {
    console.error("Error processing document details data:", error);
    return [];
  }
};
