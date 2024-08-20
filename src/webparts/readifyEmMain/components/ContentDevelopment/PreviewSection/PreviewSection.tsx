/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { memo } from "react";

interface Iprops {
  sectionId: number;
}

const PreviewSection: React.FC<Iprops> = ({ sectionId }) => {
  console.log(sectionId);

  return (
    <div>
      <div>Review</div>
    </div>
  );
};
export default memo(PreviewSection);
