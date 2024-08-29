/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDocNameWithLastVersion(
  docName: string,
  docVersion: any,
  withPill: boolean = true
): string | JSX.Element {
  // Find the last underscore before the file extension
  const lastUnderscoreIndex = docName.lastIndexOf("_");
  const lastDotIndex = docName.lastIndexOf(".");

  if (
    lastUnderscoreIndex === -1 ||
    lastDotIndex === -1 ||
    lastUnderscoreIndex > lastDotIndex
  ) {
    // If no valid underscore or dot is found, return the document name as is
    return docName;
  }

  // Extract the version and the base name
  const version = docName.substring(lastUnderscoreIndex + 1, lastDotIndex);
  const baseName =
    docName.substring(0, lastUnderscoreIndex) + docName.substring(lastDotIndex);

  if (withPill) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {baseName}
        <span
          style={{
            padding: "0 7px",
            height: "20px",
            fontFamily: "interSemiBold, sans-serif",
            borderRadius: "4px",
            backgroundColor: "#6536F9",
            color: "#f7f7f7",
            fontSize: "13px",
            display: "grid",
            placeItems: "center",
          }}
        >
          v{docVersion || version}
        </span>
      </div>
    );
  }

  return baseName;
}

export function removeVersionFromDocName(docName: string): string {
  // Find the last underscore in the document name
  const lastUnderscoreIndex = docName?.lastIndexOf("_");

  if (lastUnderscoreIndex === -1) {
    // If no underscore is found, return the document name as is
    return docName;
  }

  // Extract the base name, omitting the version and everything after the last underscore
  return docName?.substring(0, lastUnderscoreIndex);
}
