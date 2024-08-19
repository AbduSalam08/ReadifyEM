/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/statusLabel.ts

import { Check } from "@mui/icons-material";
import SecondaryTextLabel from "../SecondaryText/SecondaryText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const ContentDeveloperStatusLabel = (
  sectionSubmitted: any,
  sectionReviewed: any,
  sectionApproved: any,
  sectionRework: any,
  currentDocDetailsData: any,
  currentDocRole: any,
  loggerPromoter: any
): any => {
  const iconPending = (
    <AccessTimeIcon
      style={{
        width: "17px",
      }}
    />
  );

  const iconComplete = (
    <Check
      style={{
        width: "18px",
      }}
    />
  );

  let currentStageStatus = "In Development";

  if (
    currentDocDetailsData?.reviewers?.some(
      (item: any) => item?.status === "in progress"
    )
  ) {
    currentStageStatus = "In Review";
  } else if (
    currentDocDetailsData?.approvers?.some(
      (item: any) => item?.status === "in progress"
    )
  ) {
    currentStageStatus = "In Approval";
  }

  if (
    sectionSubmitted &&
    !sectionReviewed &&
    loggerPromoter?.status !== "completed" &&
    currentStageStatus === "In Review"
  ) {
    return <SecondaryTextLabel icon={iconPending} text="Yet to be reviewed" />;
  } else if (
    sectionSubmitted &&
    !sectionApproved &&
    loggerPromoter?.status !== "completed" &&
    currentStageStatus === "In Approval"
  ) {
    return <SecondaryTextLabel icon={iconPending} text="Yet to be approved" />;
  } else if (
    currentDocRole.reviewer &&
    ((sectionSubmitted && sectionReviewed) ||
      loggerPromoter?.status === "completed")
  ) {
    return (
      <SecondaryTextLabel
        icon={iconComplete}
        text="Reviewed"
        externalStyles={{
          color: "#4CAF50",
        }}
      />
    );
  } else if (
    currentDocRole.approver &&
    ((sectionSubmitted && sectionApproved) ||
      loggerPromoter?.status === "completed")
  ) {
    return (
      <SecondaryTextLabel
        icon={iconComplete}
        text="Approved"
        externalStyles={{
          color: "#4CAF50",
        }}
      />
    );
  } else if (!currentDocRole?.sectionAuthor && !currentDocRole?.primaryAuthor) {
    return <SecondaryTextLabel icon={iconPending} text="In Development" />;
  }
};
