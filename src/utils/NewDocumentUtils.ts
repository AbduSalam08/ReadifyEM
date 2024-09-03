/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @rushstack/no-new-null */
import * as dayjs from "dayjs";
import { LibraryItem } from "../services/EMManual/EMMServices";

// function to find and get the data based on the given URL
export const filterDataByURL = (url: string, data: any[]): LibraryItem[] => {
  const lowercasedURLTerm = url?.toLowerCase();

  const filterRecursive = (items: LibraryItem[]): LibraryItem[] => {
    let result: LibraryItem[] = [];

    items.forEach((item) => {
      const matchesURL = item.url.toLowerCase() === lowercasedURLTerm;

      if (matchesURL) {
        result.push({ ...item }); // Exclude nested items
      }

      if (item.items) {
        const filteredChildren = filterRecursive(item.items);
        result = result.concat(filteredChildren); // Collect nested matches
      }
    });

    return result;
  };

  return filterRecursive(data);
};

// function to find out data for the mentioned term
export const validateAndFindDate = (term: string): string | null => {
  // Regular expression to match the term pattern
  const match: number = term.toLowerCase().includes("two")
    ? 2
    : term.toLowerCase().includes("three")
    ? 3
    : 1;

  if (match) {
    const futureDate = dayjs().add(match, "year");

    // Format the future date to DD/MM/YYYY
    return futureDate.format("DD/MM/YYYY");
  }

  return null;
};

// function to find out data for the mentioned term
export const calculateDocDueDateByTerm = (
  currentDate: any,
  term: string
): string | null => {
  // Regular expression to match the term pattern
  const match: number = term.toLowerCase().includes("two")
    ? 2
    : term.toLowerCase().includes("three")
    ? 3
    : 1;

  if (match) {
    const futureDate = dayjs(currentDate).add(match, "year");

    // Format the future date to DD/MM/YYYY
    return futureDate.format("DD/MM/YYYY");
  }

  return null;
};
