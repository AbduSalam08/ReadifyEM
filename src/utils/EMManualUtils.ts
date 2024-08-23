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

/**
 * Calculates the next minor and major versions.
 * @param currentVersion - The current version as a string (e.g., "1.11").
 * @returns An object containing the next minor and major versions.
 */
export function getNextVersions(currentVersion: string): {
  minorVersion: string;
  majorVersion: string;
} {
  const versionParts = currentVersion.split(".").map(Number);

  if (versionParts.length !== 2) {
    throw new Error("Invalid version format. Expected format is X.Y");
  }

  const [major, minor] = versionParts;

  // Calculate the next minor version
  const nextMinor = minor + 1;
  const minorVersion = `${major}.${nextMinor}`;

  // Calculate the next major version
  const nextMajor = major + 1;
  const majorVersion = `${nextMajor}.0`;

  return {
    minorVersion,
    majorVersion,
  };
}

/**
 * Replaces the text after the underscore in a filename with the specified new version.
 * @param filename - The original filename (e.g., "Sample Document X1_1.1").
 * @param newVersion - The new version string to replace the existing one (e.g., "1.3").
 * @returns The updated filename with the new version.
 */
export function replaceVersionInFilename(
  filename: string,
  newVersion: string
): string {
  const underscoreIndex = filename.lastIndexOf("_");

  if (underscoreIndex === -1) {
    throw new Error("Filename does not contain an underscore.");
  }

  // Extract the part before the underscore and append the new version
  const newFilename = `${filename.substring(
    0,
    underscoreIndex + 1
  )}${newVersion}`;
  return newFilename;
}
