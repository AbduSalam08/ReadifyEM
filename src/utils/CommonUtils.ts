/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const compareArraysOfObjects = async (
  arr1: any,
  arr2: any
): Promise<any> => {
  // If arrays have different lengths, they are not equal
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Sort arrays to ensure comparison order doesn't matter
  const sortedArr1 = arr1
    .slice()
    .sort((a: any, b: any) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b))
    );
  const sortedArr2 = arr2
    .slice()
    .sort((a: any, b: any) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b))
    );

  // Compare each object in the arrays
  for (let i = 0; i < sortedArr1.length; i++) {
    const obj1 = sortedArr1[i];
    const obj2 = sortedArr2[i];

    // Get keys from both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, objects are not equal
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Compare values for each key
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false; // Return false if any key-value pair doesn't match
      }
    }
  }

  return true; // Return true if all key-value pairs match
};
