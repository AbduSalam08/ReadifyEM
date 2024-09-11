/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// css
import "./RichText.css";
import DefaultButton from "../../common/Buttons/DefaultButton";
import {
  addRejectedComment,
  addChangeRecord,
  // AddAttachment,
  UpdateAttachment,
} from "../../../../../services/ContentDevelopment/CommonServices/CommonServices";
import SpServices from "../../../../../services/SPServices/SpServices";
import { base64Data, LISTNAMES } from "../../../../../config/config";
import { useNavigate } from "react-router-dom";
import CircularSpinner from "../../common/AppLoader/CircularSpinner";
import ToastMessage from "../../common/Toast/ToastMessage";
import { togglePopupVisibility } from "../../../../../utils/togglePopup";
import Popup from "../../common/Popups/Popup";
import CustomTextArea from "../../common/CustomInputFields/CustomTextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentLoggedPromoter,
  getCurrentPromoter,
  updateSectionDataLocal,
  updateTaskCompletion,
} from "../../../../../utils/contentDevelopementUtils";
import { setCDSectionData } from "../../../../../redux/features/ContentDevloperSlice";
import { ContentDeveloperStatusLabel } from "../../common/ContentDeveloperStatusLabel/ContentDeveloperStatusLabel";
import CustomPeoplePicker from "../../common/CustomInputFields/CustomPeoplePicker";
import dayjs from "dayjs";
import CustomDateInput from "../../common/CustomInputFields/CustomDateInput";
import PreviewSection from "../PreviewSection/PreviewSection";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { sp } from "@pnp/sp";

interface IRichTextProps {
  noActionBtns?: boolean;
  currentSectionData?: any;
  activeIndex?: any;
  setSectionData?: any;
  ID?: any;
  onChange?: any;
  currentDocRole?: any;
  checkChanges?: any;
}

const RichText = ({
  currentSectionData,
  noActionBtns,
  activeIndex,
  setSectionData,
  ID,
  onChange,
  currentDocRole,
  checkChanges,
}: IRichTextProps): JSX.Element => {
  const quillRef = useRef<any>(null);
  const dispatch = useDispatch();

  const initialPopupController = [
    {
      open: false,
      popupTitle: "Are you sure want to submit this section?",
      popupWidth: "340px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "550px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "Are you sure want to mark this section as reviewed?",
      popupWidth: "340px",
      popupType: "confirmation",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "550px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
    {
      open: false,
      popupTitle: "",
      popupWidth: "950px",
      popupType: "custom",
      defaultCloseBtn: false,
      popupData: "",
    },
  ];
  // Rejected comments state
  const [rejectedComments, setRejectedComments] = useState<any>({
    rejectedComment: "",
    IsValid: false,
    ErrorMsg: "",
  });
  const currentUserDetails: any = useSelector(
    (state: any) => state?.MainSPContext?.currentUserDetails
  );

  const currentDocDetailsData: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDDocDetails
  );

  const AllSectionsDataMain: any = useSelector(
    (state: any) => state.ContentDeveloperData.CDSectionsData
  );

  const AllSectionsComments: any = useSelector(
    (state: any) => state.SectionData.SectionComments
  );

  const sectionChangeRecord: any = useSelector(
    (state: any) => state.SectionData.sectionChangeRecord
  );

  const [popupController, setPopupController] = useState(
    initialPopupController
  );

  // util for closing popup
  const handleClosePopup = (index?: any): void => {
    togglePopupVisibility(setPopupController, index, "close");
  };

  // Change record state
  const [changeRecordDetails, setChangeRecordDetails] = useState<any>({
    author: sectionChangeRecord.changeRecordAuthor
      ? sectionChangeRecord.changeRecordAuthor
      : currentUserDetails,
    currentDate: dayjs(new Date(sectionChangeRecord.changeRecordModify)).format(
      "DD-MMM-YYYY hh:mm A"
    ),
    lastSubmitDate: "",
    Description: sectionChangeRecord.changeRecordDescription,
    IsValid: false,
    ErrorMsg: "",
  });

  const submitChangeRecord = async (): Promise<any> => {
    if (changeRecordDetails.Description?.trimStart() !== "") {
      await addChangeRecord(
        changeRecordDetails,
        currentSectionData?.ID,
        currentDocDetailsData.documentDetailsID,
        handleClosePopup,
        3,
        setToastMessage,
        setChangeRecordDetails,
        currentUserDetails,
        dispatch
      );
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: false,
        ErrorMsg: "",
      });
    } else {
      setChangeRecordDetails({
        ...changeRecordDetails,
        IsValid: true,
        ErrorMsg: "Please enter Description",
      });
    }
  };

  const popupInputs: any[] = [
    [],
    [
      <CustomTextArea
        size="MD"
        labelText="Comments"
        withLabel
        icon={false}
        mandatory={true}
        textAreaWidth={"100%"}
        value={rejectedComments.rejectedComment}
        onChange={(value: any) => {
          setRejectedComments({
            ...rejectedComments,
            rejectedComment: value,
            IsValid: false,
          });
        }}
        placeholder="Enter Description"
        isValid={rejectedComments.IsValid}
        errorMsg={rejectedComments.ErrorMsg}
        key={2}
      />,
    ],
    [],
    [
      <div
        style={{ display: "flex", gap: "9px", flexDirection: "column" }}
        key={1}
      >
        <CustomDateInput
          size="MD"
          withLabel
          label="Last change date"
          readOnly
          value={changeRecordDetails.currentDate}
          key={1}
        />
        <CustomPeoplePicker
          size="MD"
          minWidth={"265px"}
          withLabel
          labelText="Author"
          // onChange={(value: any) => {
          //   handleOnChange(value, "referenceAuthor");
          // }}
          selectedItem={changeRecordDetails?.author?.email}
          placeholder="Add people"
          // isValid={
          //   definitionsData.referenceAuthor.length === 0 &&
          //   !definitionsData.IsValid
          // }
          errorMsg={"The reference author field is required"}
          readOnly
          key={2}
        />
        <CustomTextArea
          size="MD"
          labelText="Description"
          withLabel
          topLabel={true}
          icon={false}
          mandatory={true}
          rows={7}
          textAreaWidth={"100%"}
          // textAreaWidth={"67%"}
          value={changeRecordDetails.Description}
          onChange={(value: any) => {
            setChangeRecordDetails({
              ...changeRecordDetails,
              Description: value,
              IsValid: false,
            });
          }}
          placeholder="Enter Description"
          isValid={changeRecordDetails.IsValid}
          errorMsg={changeRecordDetails.ErrorMsg}
          key={3}
        />
      </div>,
    ],
    [
      <div key={1}>
        <span
          style={{
            display: "flex",
            paddingBottom: "15px",
            fontSize: "22px",
            fontFamily: "interMedium, sans-serif",
          }}
        >
          {currentSectionData.sectionOrder +
            ". " +
            currentSectionData.sectionName}
        </span>
        <PreviewSection
          sectionId={currentSectionData?.ID}
          sectionDetails={currentSectionData}
        />
      </div>,
    ],
  ];

  const popupActions: any[] = [
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(0);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await addData("submit");
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(1);
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitRejectedComment();
        },
      },
    ],
    [
      {
        text: "No",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(2);
        },
      },
      {
        text: "Yes",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          handleClosePopup(2);
          await promoteSection();
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(3);
          setChangeRecordDetails({
            ...changeRecordDetails,
            author: sectionChangeRecord.changeRecordAuthor
              ? sectionChangeRecord.changeRecordAuthor
              : currentUserDetails,
            Description: sectionChangeRecord.changeRecordDescription,
            currentDate: dayjs(
              new Date(sectionChangeRecord.changeRecordModify)
            ).format("DD-MMM-YYYY hh:mm A"),
            IsValid: false,
          });
        },
      },
      {
        text: "Submit",
        btnType: "primary",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: async () => {
          // handleClosePopup(2);
          await submitChangeRecord();
        },
      },
    ],
    [
      {
        text: "Cancel",
        btnType: "darkGreyVariant",
        disabled: false,
        endIcon: false,
        startIcon: false,
        onClick: () => {
          handleClosePopup(4);
        },
      },
    ],
  ];

  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });
  const [sectionLoader, setSectionLoader] = useState(true);

  // Step 3: Extend Quill's toolbar with your custom button
  // const CustomToolbar = () => (
  //   <div id="toolbar">
  //     <button className="ql-header" value="1" />
  //     <button className="ql-header" value="2" />
  //     <button className="ql-bold" />
  //     <button className="ql-italic" />
  //     <button className="ql-underline" />
  //     <button className="ql-list" value="ordered" />
  //     <button className="ql-list" value="bullet" />
  //     <button className="ql-indent" value="-1" />
  //     <button className="ql-indent" value="+1" />
  //     <button className="ql-image" />
  //     <button className="ql-clean" />
  //     <span className="ql-customButton" />
  //   </div>
  // );

  // Function to sanitize folder name
  const sanitizeFolderName = (name: any): Promise<string> => {
    // Replace or remove invalid characters for SharePoint folder names
    return name.replace(/[:~"#%&*<>?/\\{|}.]/g, "");
  };

  // Function to check if folder exists
  const folderExists = async (
    libraryName: string,
    folderPath: string
  ): Promise<any> => {
    try {
      const folder = await sp.web
        .getFolderByServerRelativeUrl(
          `/sites/ReadifyEM/${libraryName}/${folderPath}`
        )
        .get();
      return folder ? true : false;
    } catch (error) {
      if (error.message.includes("404")) {
        return false; // Folder not found
      } else {
        throw error; // Other errors
      }
    }
  };

  const handleFileUpload = async (
    file: File,
    sectionDetails: any,
    currentDocumentDetails: any
  ): Promise<any> => {
    const libraryName = "Shared Documents";
    // Sanitize folder names
    const sanitizedDocumentName = sanitizeFolderName(
      currentDocumentDetails.documentName
    );
    const sanitizedSectionName = sanitizeFolderName(sectionDetails.sectionName);
    try {
      // Check if the file already exists
      // const folderPath = "/sites/ReadifyEM/Shared Documents"; // Replace with your actual folder path
      const fileName = file.name;
      const fileUrl = `/sites/ReadifyEM/${libraryName}/${sanitizedDocumentName}/${sanitizedSectionName}/${fileName}`;
      const fileExists = await sp.web.getFileByServerRelativeUrl(fileUrl).get();

      const checkLocally = description.includes(fileName);
      if (checkLocally) {
        alert("File already exists");
      } else if (fileExists) {
        // Upload the file to SharePoint
        const fileAddResult = await sp.web
          .getFolderByServerRelativeUrl(
            `/sites/ReadifyEM/${libraryName}/${sanitizedDocumentName}/${sanitizedSectionName}`
          )
          .files.add(file.name, file, true);

        const fileUrl = fileAddResult.data.ServerRelativeUrl;

        return `${window.location.origin}${fileUrl}`;
      }
    } catch (error) {
      console.log("Error uploading file:", error.code);
      if (
        error.message.includes("File not found") ||
        error.message.includes("-2130575338") ||
        error.message.includes("-2147024809")
      ) {
        try {
          const documentFolderExists = await folderExists(
            libraryName,
            await sanitizedDocumentName
          );
          if (!documentFolderExists) {
            //Create 'document_name' folder in the library
            await sp.web.folders.add(
              `/sites/ReadifyEM/${libraryName}/${sanitizedDocumentName}`
            );
          }

          const sectionFolderExists = await folderExists(
            libraryName,
            `${sanitizedDocumentName}/${sanitizedSectionName}`
          );

          if (!sectionFolderExists) {
            // Create 'section_name' folder inside 'document_name' folder
            await sp.web.folders.add(
              `/sites/ReadifyEM/${libraryName}/${sanitizedDocumentName}/${sanitizedSectionName}`
            );
          }

          // Upload the file to SharePoint
          const fileAddResult = await sp.web
            .getFolderByServerRelativeUrl(
              `/sites/ReadifyEM/${libraryName}/${sanitizedDocumentName}/${sanitizedSectionName}`
            )
            .files.add(file.name, file, true);

          const item = await fileAddResult.file.getItem();
          await item.update({
            documentDetailsId: currentDocumentDetails.documentDetailsID, // Replace with your lookup field's internal name
          });
          // Get the file URL
          const fileUrl = fileAddResult.data.ServerRelativeUrl;

          // Return the full file URL
          return `${window.location.origin}${fileUrl}`;
        } catch (uploadError) {
          console.log("Error uploading file:", uploadError);
          return null;
        }
      } else {
        console.log("Error checking file existence:", error);
        return null;
      }
    }
  };

  // Function to trigger file upload dialog and insert link into the editor
  const handleAddFile = async (): Promise<void> => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".xls,.xlsx,.doc,.docx,.txt"; // Accept only Excel, Word, and TXT files

    fileInput.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const fileUrl = await handleFileUpload(
          file,
          currentSectionData,
          currentDocDetailsData
        );
        if (fileUrl && quillRef.current) {
          const quill = quillRef.current.getEditor();
          // Get current cursor position
          const range = quill.getSelection();

          let rangeIndex: number = 0;

          // Check if the range is null or invalid
          if (range) {
            // If the range is valid, insert a newline at the current index
            rangeIndex = range.index;
          } else {
            // If the range is null, get the length of the content and insert a newline at the end
            rangeIndex = quill.getLength(); // Returns the last index
          }

          const iconHtml = `<span><img src="${
            base64Data.file
          }" style="width:11px !important; height:15px !important; vertical-align:middle;margin-right:8px;" />
          <a style="margin-right:10px;" href=${encodeURI(
            fileUrl
          )} rel="noopener noreferrer" target="_blank">${file.name}</a>
          </span>`;

          quill.clipboard.dangerouslyPasteHTML(rangeIndex, iconHtml);

          rangeIndex += file.name.length + 1;

          // Insert a new line after the link
          quill.insertText(rangeIndex, " ");

          // Move the cursor to the start of the new line
          quill.setSelection(rangeIndex + 1);
        }
      }
    };

    fileInput.click(); // Trigger the file input dialog
  };

  const modules: any = {
    toolbar: [
      [
        {
          header: [1, 2, 3, false],
        },
      ],
      ["bold", "italic", "underline"],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
      [
        {
          list: "ordered",
        },
        {
          list: "bullet",
        },
        {
          indent: "-1",
        },
        {
          indent: "+1",
        },
      ],
      ["image"],
      ["clean"],
    ],
  };

  const navigate = useNavigate();
  const formats: string[] = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "background",
    "color",
  ];

  // const [newAttachment, setNewAttachment] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");
  const [masterDescription, setMasterDescription] = useState<string>("");

  // const _handleOnChange = (newText: string): string => {
  //   setDescription(newText === "<p><br></p>" ? "" : newText);
  //   onChange && onChange(newText === "<p><br></p>" ? "" : newText);
  //   return newText;
  // };

  const handleChange = async (
    html: string,
    delta: any,
    source: any,
    editor: any
  ): Promise<any> => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const currentContents = quill.getContents();
      let cumulativeIndex = 0;

      for (let i = 0; i < currentContents.ops.length; i++) {
        const op = currentContents.ops[i];
        if (op.insert && op.insert.image) {
          const imgSrc = op.insert.image;

          try {
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            // Check if the image is a GIF using the MIME type
            if (
              blob.type === "image/gif"
              // blob.type === "text/plain" ||
              // blob.type === "application/pdf"
            ) {
              quill.deleteText(cumulativeIndex, 1);
              alert("GIF images are not allowed and have been removed.");
              cumulativeIndex -= 1;
              continue;
            }

            if (blob.size >= 500 * 1024) {
              // 1MB limit
              // Remove the large image from the editor's content
              quill.deleteText(cumulativeIndex, 1);
              alert("Image size should be below 500KB.");
              cumulativeIndex -= 1;
            } else {
              // Apply the width and height styles to all images with the same src
              const imageElements = quill.container.querySelectorAll(
                `img[src="${imgSrc}"]`
              );
              imageElements.forEach((imageElement: any) => {
                if (imgSrc.startsWith(base64Data.file)) {
                  // Set style for the base64 icon
                  imageElement.setAttribute("class", "fileAttachmentIcon");
                  imageElement.setAttribute(
                    "style",
                    "width: 11px;height:15px;vertical-align:middle;"
                  );
                } else {
                  // Set style for other images
                  imageElement.setAttribute(
                    "style",
                    "width: 400px;height:400px"
                  );

                  // Get the parent <p> tag and apply text-align center
                  // const parentParagraph = imageElement.closest("p");
                  // if (parentParagraph) {
                  //   parentParagraph.style.textAlign = "center";
                  // }
                }
              });
            }
          } catch (error) {
            console.log("Error processing image:", error);
          }
        }

        // Update the cumulative index for each op
        cumulativeIndex += op.insert
          ? typeof op.insert === "string"
            ? op.insert.length
            : 1
          : 0;
      }
      // setDescription(editor.getHTML());
      const htmlContent = editor.getHTML();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      const indentElements = doc.querySelectorAll("[class^='ql-indent-']");

      // Loop through all indented elements
      indentElements.forEach((element: any) => {
        // Extract the indent level from the class (e.g., ql-indent-1 -> 1)
        const indentClass: any = Array.from(element.classList).find(
          (cls: any) => cls.startsWith("ql-indent-")
        );
        const indentLevel = parseInt(indentClass.split("-")[2], 10);

        // Apply the margin-left based on indent level (32px * level)
        const marginLeft = `${indentLevel * 32}px`;

        // Add the margin-left inline style
        element.style.marginLeft = marginLeft;
      });

      const updatedHtml = doc.body.innerHTML;

      setDescription(updatedHtml);

      const currentHtml = editor.getHTML().trim();
      const normalizedMasterDescription = masterDescription.trim();
      const normalizedDescription = description.trim();

      // If the new content matches the initially loaded data (masterDescription), set checkChanges to false
      if (
        currentHtml === normalizedMasterDescription ||
        normalizedMasterDescription === normalizedDescription
      ) {
        await checkChanges(false);
      } else {
        await checkChanges(true);
      }

      return editor.getHTML();
    }

    // setDescription(html === "<p><br></p>" ? "" : html);
    // onChange && onChange(html === "<p><br></p>" ? "" : html);
    // return html;
  };

  const readTextFileFromTXT = async (data: any): Promise<void> => {
    setSectionLoader(true);
    await SpServices.SPReadAttachments({
      ListName: "SectionDetails",
      ListID: ID,
      AttachmentName: data?.FileName,
    })
      .then((res: any) => {
        const parsedValue: any = res ? JSON.parse(res) : "";
        if (typeof parsedValue === "string") {
          setDescription(parsedValue);
          setMasterDescription(parsedValue);
          onChange && onChange(parsedValue);
          setSectionLoader(false);
        } else {
          setSectionLoader(false);
        }
      })
      .catch((err: any) => {
        setDescription("");
        onChange && onChange("");
        setMasterDescription("");
        console.log("Error : ", err);
      });
  };

  const submitRejectedComment = async (): Promise<any> => {
    if (rejectedComments.rejectedComment?.trim() !== "") {
      setRejectedComments({
        ...rejectedComments,
        rejectedComment: "",
        IsValid: false,
        ErrorMsg: "",
      });
      await addRejectedComment(
        rejectedComments.rejectedComment,
        currentDocDetailsData,
        currentSectionData?.ID,
        handleClosePopup,
        setToastMessage,
        setToastMessage,
        currentUserDetails,
        AllSectionsComments,
        AllSectionsDataMain,
        dispatch
      );
      await updateTaskCompletion(
        currentSectionData?.sectionName,
        currentSectionData?.documentOfId,
        "active"
      );
    } else {
      setRejectedComments({
        ...rejectedComments,
        IsValid: true,
        ErrorMsg: "Please enter comments",
      });
    }
  };

  const getSectionData = async (): Promise<any> => {
    setSectionLoader(true);
    await SpServices.SPGetAttachments({
      Listname: LISTNAMES.SectionDetails,
      ID: ID,
    })
      .then((res: any) => {
        const filteredItem: any = res?.filter(
          (item: any) => item?.FileName === "Sample.txt"
        );
        if (
          filteredItem?.length !== 0 &&
          currentSectionData?.contentType !== "list"
        ) {
          readTextFileFromTXT(filteredItem[0]);
          // setNewAttachment(false);
        } else {
          setDescription("");
          onChange && onChange("");
          setMasterDescription("");
          setSectionLoader(false);
        }
      })
      .catch((err) => {
        setDescription("");
        onChange && onChange("");
        setMasterDescription("");
        setSectionLoader(false);
      });
  };

  const convertToTxtFile = (): any => {
    const blob = new Blob([JSON.stringify(description)], {
      type: "text/plain",
    });
    const file: any = new File([blob], "Sample.txt", { type: "text/plain" });
    return file;
  };

  const addData = async (submissionType?: any): Promise<any> => {
    checkChanges(false);

    togglePopupVisibility(
      setPopupController,
      0,
      "close",
      "Are you sure want to submit this section?"
    );
    if (description === "" || description === "<p><br></p>") {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Invalid submission!",
        message: "Please add content to submit a section.",
        duration: 3000,
      });
      return;
    }

    setSectionLoader(true);
    let addDataPromises: Promise<any>;
    const _file: any = await convertToTxtFile();

    // if (newAttachment) {
    //   addDataPromises = await AddAttachment(
    //     ID,
    //     _file,
    //     "paragraph",
    //     submissionType === "submit"
    //   );
    // } else {
    // sectionName

    if (submissionType === "submit") {
      await updateTaskCompletion(
        currentSectionData?.sectionName,
        currentSectionData?.documentOfId,
        "completed"
      );
    }

    addDataPromises = await UpdateAttachment(
      ID,
      _file,
      "paragraph",
      submissionType === "submit",
      "Sample.txt",
      AllSectionsDataMain,
      dispatch,
      currentDocDetailsData
    );
    Promise.all([addDataPromises])
      .then((res: any) => {
        setSectionLoader(false);

        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });
      })
      .catch((err: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
      });
  };

  const docInReview: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in review";

  const docInApproval: boolean =
    currentDocDetailsData?.documentStatus?.toLowerCase() === "in approval";

  const promoteSection = async (): Promise<any> => {
    togglePopupVisibility(
      setPopupController,
      2,
      "close",
      "Are you sure want to submit this section?"
    );
    setSectionLoader(true);

    const promoters: any = docInReview
      ? currentDocDetailsData?.reviewers
      : docInApproval
      ? currentDocDetailsData?.approvers
      : [];

    const currentPromoter: any = getCurrentPromoter(promoters);

    const promoterKey: string = currentDocRole?.reviewer
      ? "sectionReviewed"
      : currentDocRole?.approver
      ? "sectionApproved"
      : "";

    await SpServices.SPUpdateItem({
      Listname: LISTNAMES.SectionDetails,
      ID: currentSectionData?.ID,
      RequestJSON: {
        [`${promoterKey}`]: true,
        lastReviewedBy: JSON.stringify({
          currentOrder: currentPromoter?.currentOrder,
          currentPromoter: currentPromoter?.currentPromoter?.userData,
          totalPromoters: currentPromoter?.totalPromoters,
        }),
      },
    })
      .then((res: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Content updated!",
          message: "The content has been updated successfully.",
          duration: 3000,
        });

        const updatedSections: any = updateSectionDataLocal(
          AllSectionsDataMain,
          currentSectionData?.ID,
          {
            [`${promoterKey}`]: true,
            sectionRework: false,
            lastReviewedBy: {
              currentOrder: currentPromoter?.currentOrder,
              currentPromoter: currentPromoter?.userData,
              totalPromoters: currentPromoter?.totalPromoters,
            },
          }
        );

        dispatch(setCDSectionData([...updatedSections]));
      })
      .catch((err: any) => {
        setSectionLoader(false);
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Something went wrong!",
          message:
            "A unexpected error happened while updating! please try again later.",
          duration: 3000,
        });
      });
  };

  const loggerPromoter: any = getCurrentLoggedPromoter(
    currentDocRole,
    currentDocDetailsData,
    currentUserDetails
  );

  useEffect(() => {
    setSectionLoader(true);
    if (currentSectionData?.contentType === "paragraph") {
      getSectionData();
    }
  }, [ID, currentSectionData?.ID]);

  useEffect(() => {
    setChangeRecordDetails({
      ...changeRecordDetails,
      author: sectionChangeRecord.changeRecordAuthor
        ? sectionChangeRecord.changeRecordAuthor
        : currentUserDetails,
      Description: sectionChangeRecord.changeRecordDescription,
      currentDate: dayjs(
        new Date(sectionChangeRecord.changeRecordModify)
      ).format("DD-MMM-YYYY hh:mm A"),
    });
  }, [sectionChangeRecord.changeRecordDescription]);

  return (
    <div
      style={{
        // height: "100%",
        height: "calc(100% - 30px)",
        position: "relative",
      }}
    >
      {sectionLoader && !noActionBtns ? (
        <div className="contentDevLoaderWrapper">
          <CircularSpinner />
        </div>
      ) : (
        <ReactQuill
          ref={quillRef}
          theme="snow"
          modules={modules}
          formats={formats}
          value={description}
          readOnly={
            !currentSectionData?.sectionSubmitted &&
            (currentDocRole?.sectionAuthor || currentDocRole?.primaryAuthor)
              ? false
              : true
          }
          placeholder="Content goes here"
          className="customeRichText"
          // onChange={(text) => {
          //   _handleOnChange(text);
          // }}
          onChange={handleChange}
        />
      )}
      <div style={{ position: "absolute", top: "7px", right: "10px" }}>
        {/* <button onClick={handleAddFile}>Add File</button> */}
        {!currentSectionData?.sectionSubmitted &&
          (currentDocRole?.sectionAuthor || currentDocRole?.primaryAuthor) && (
            <DefaultButton
              text="Attachment"
              startIcon={
                <AttachFileIcon
                  sx={{
                    transform: "rotate(25deg)",
                  }}
                />
              }
              btnType="lightGreyVariant"
              title="Add attachment"
              style={{
                letterSpacing: "0px",
              }}
              onlyIcon={true}
              onClick={() => {
                handleAddFile();
              }}
              size="small"
            />
          )}
      </div>
      {!noActionBtns ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "15px",
          }}
        >
          <button className={"helpButton"}>Help?</button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "15px",
            }}
          >
            {ContentDeveloperStatusLabel(
              currentSectionData?.sectionSubmitted,
              currentSectionData?.sectionReviewed,
              currentSectionData?.sectionApproved,
              currentSectionData?.sectionRework,
              currentDocDetailsData,
              currentDocRole,
              loggerPromoter
            )}

            <DefaultButton
              text={<CloseIcon sx={{ Padding: "0px" }} />}
              btnType="darkGreyVariant"
              title="Close"
              onlyIcon={true}
              onClick={() => {
                checkChanges(false);
                navigate(-1);
              }}
            />
            {!currentSectionData?.sectionSubmitted &&
              (currentDocRole?.sectionAuthor ||
                currentDocRole?.primaryAuthor) && (
                <>
                  <DefaultButton
                    text={<RestartAltIcon />}
                    onlyIcon={true}
                    title="Reset Content"
                    disabled={sectionLoader}
                    btnType="secondaryRed"
                    onClick={() => {
                      setSectionData((prev: any) => {
                        const updatedSections = [...prev];
                        updatedSections[activeIndex] = {
                          ...updatedSections[activeIndex],
                          contentType: "initial",
                        };
                        return updatedSections;
                      });
                    }}
                  />
                </>
              )}
            <DefaultButton
              text="Preview"
              btnType="secondaryBlue"
              onClick={() => {
                togglePopupVisibility(setPopupController, 4, "open", "Preview");
              }}
            />

            {currentDocDetailsData?.version !== "1.0" &&
              !currentDocRole?.reviewer &&
              !currentDocRole?.consultant &&
              !currentDocRole?.approver &&
              !currentSectionData?.sectionSubmitted && (
                <DefaultButton
                  text="Change record"
                  btnType="primaryGreen"
                  onClick={() => {
                    togglePopupVisibility(
                      setPopupController,
                      3,
                      "open",
                      "Change record"
                    );
                  }}
                />
              )}

            {(currentDocRole?.primaryAuthor ||
              currentDocRole?.sectionAuthor ||
              currentDocRole?.reviewer ||
              currentDocRole?.approver) && (
              <>
                {currentDocRole?.primaryAuthor
                  ? currentSectionData?.sectionSubmitted && (
                      <DefaultButton
                        text="Rework"
                        disabled={
                          !["in development", "in rework", "approved"].includes(
                            currentDocDetailsData?.documentStatus?.toLowerCase()
                          )
                        }
                        btnType="secondaryRed"
                        onClick={() => {
                          togglePopupVisibility(
                            setPopupController,
                            1,
                            "open",
                            "Reason for rejection"
                          );
                        }}
                      />
                    )
                  : (currentDocRole?.reviewer || currentDocRole?.approver) && (
                      <>
                        {
                          <DefaultButton
                            text={
                              // currentDocRole?.reviewer
                              //   ? "Review"
                              //   : currentDocRole?.approver && "Approve"
                              "Approve"
                            }
                            disabled={
                              !sectionLoader &&
                              currentSectionData?.sectionSubmitted &&
                              !currentSectionData?.sectionRework &&
                              ((currentDocRole?.reviewer &&
                                !currentSectionData?.sectionReviewed) ||
                                (currentDocRole?.approver &&
                                  !currentSectionData?.sectionApproved)) &&
                              loggerPromoter?.status !== "completed"
                                ? false
                                : true
                            }
                            btnType="primary"
                            onClick={() => {
                              togglePopupVisibility(
                                setPopupController,
                                2,
                                "open",
                                `Are you sure want to mark this section as ${
                                  currentDocRole?.reviewer
                                    ? "reviewed"
                                    : currentDocRole?.approver && "approved"
                                }?`
                              );
                            }}
                          />
                        }

                        <DefaultButton
                          text="Rework"
                          disabled={
                            !sectionLoader &&
                            loggerPromoter?.status !== "completed"
                              ? false
                              : true
                          }
                          btnType="secondaryRed"
                          onClick={() => {
                            togglePopupVisibility(
                              setPopupController,
                              1,
                              "open",
                              "Reason for rejection"
                            );
                          }}
                        />
                      </>
                    )}

                {!currentSectionData?.sectionSubmitted &&
                  (currentDocRole?.sectionAuthor ||
                    currentDocRole?.primaryAuthor) && (
                    <>
                      <DefaultButton
                        text="Save"
                        disabled={sectionLoader}
                        btnType="lightGreyVariant"
                        onClick={async () => {
                          await addData();
                        }}
                      />
                      {(currentDocRole?.sectionAuthor ||
                        currentDocRole?.primaryAuthor) && (
                        <DefaultButton
                          text="Submit"
                          disabled={sectionLoader}
                          btnType="primary"
                          onClick={() => {
                            // await addData("submit");
                            togglePopupVisibility(
                              setPopupController,
                              0,
                              "open",
                              "Are you sure want to submit this section?"
                            );
                          }}
                        />
                      )}
                    </>
                  )}
              </>
            )}
          </div>
        </div>
      ) : (
        currentSectionData?.sectionType?.toLowerCase() !==
          "appendix section" && (
          <DefaultButton
            text={<CloseIcon sx={{ Padding: "0px" }} />}
            title="Close"
            onlyIcon={true}
            btnType="darkGreyVariant"
            onClick={() => {
              navigate(-1);
            }}
            style={{
              marginTop: "10px",
            }}
          />
        )
      )}
      <ToastMessage
        severity={toastMessage.severity}
        title={toastMessage.title}
        message={toastMessage.message}
        duration={toastMessage.duration}
        isShow={toastMessage.isShow}
        setToastMessage={setToastMessage}
      />
      {popupController?.map((popupData: any, index: number) => (
        <Popup
          key={index}
          // isLoading={sectionLoader}
          PopupType={popupData.popupType}
          onHide={() =>
            togglePopupVisibility(setPopupController, index, "close")
          }
          popupTitle={
            popupData.popupType !== "confimation" && popupData.popupTitle
          }
          popupActions={popupActions[index]}
          visibility={popupData.open}
          content={popupInputs[index]}
          popupWidth={popupData.popupWidth}
          defaultCloseBtn={popupData.defaultCloseBtn || false}
          confirmationTitle={
            popupData.popupType !== "custom" ? popupData.popupTitle : ""
          }
          popupHeight={index === 0 ? true : false}
        />
      ))}
    </div>
  );
};

export default RichText;
