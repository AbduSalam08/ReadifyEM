/* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// import { memo, useState } from "react";
// import styles from "./Table.module.scss"; // Importing the SCSS module
// import { TableRowLoading } from "./LoadingTemplates/TableRowLoading";
// import TableItem from "./TableItem";
// import { TableItemLoading } from "./LoadingTemplates/TableItemLoading";

// interface ITableProps {
//   headers: any[];
//   data: any[];
//   loading: boolean;
//   searchTerm: string;
// }

// const Table = ({
//   headers,
//   data,
//   loading,
//   searchTerm,
// }: ITableProps): JSX.Element => {
//   console.log("data: ", data);

//   const [DNDData, setDNDData] = useState(
//     loading
//       ? [
//           {
//             DOCName: "",
//             Children: [
//               {
//                 DocumentName: "",
//                 CreatedAt: "",
//                 NextReview: "",
//                 Status: "",
//                 Visibility: "",
//                 Action: "",
//               },
//             ],
//             ChildAcc: [],
//           },
//         ]
//       : data
//   );
//   console.log("DNDData: ", DNDData);

//   const [activeIndex, setActiveIndex] = useState<number>(-1);
//   console.log("activeIndex: ", activeIndex);

//   const [childActiveIndex, setChildActiveIndex] = useState<number>(-1);
//   console.log("childActiveIndex: ", childActiveIndex);

//   const [dragType, setDragType] = useState<string>("");
//   console.log("dragType: ", dragType);

//   const handleData = (
//     newData: any[],
//     type: string,
//     parentIndex: number,
//     childIndex: number
//   ): void => {
//     if (type !== dragType) {
//       alert("Can't drag Documents to other sections.");
//       return;
//     }

//     setDNDData((prevData) => {
//       const updatedData = [...prevData];
//       if (type === "parent") {
//         updatedData[parentIndex].Children = newData;
//       } else {
//         updatedData[parentIndex].ChildAcc[childIndex].ChildArr = newData;
//       }
//       return updatedData;
//     });
//   };

//   const togglePanel = (index: number, child = false): void => {
//     if (child) {
//       setChildActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
//     } else {
//       setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
//       setChildActiveIndex(-1);
//     }
//   };

//   const filterData = (searchTerm: string): any => {
//     return data.filter((item) => {
//       const matchingChildren = item.Children.filter((child: any) =>
//         child.DocumentName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       const matchingChildAcc = item.ChildAcc.filter((child: any) =>
//         child.ChildArr.some((childItem: any) =>
//           childItem.DocumentName.toLowerCase().includes(
//             searchTerm.toLowerCase()
//           )
//         )
//       );
//       return (
//         item.DOCName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         matchingChildren.length > 0 ||
//         matchingChildAcc.length > 0
//       );
//     });
//   };

//   const filteredData = loading ? data : filterData(searchTerm);

//   return (
//     // wrapper of the whole table data component
//     <div className={styles.tableWrapper}>
//       {/* mapping all the headers of the table headers data  */}
//       <div className={styles.tableHeadersWrapper}>
//         {headers?.map((el: any, i: number) => {
//           return (
//             <div key={i} className={styles.tableHeader}>
//               <span>{el}</span>
//             </div>
//           );
//         })}
//       </div>

//       {/* mapping the data of the draggable table rows & columns */}
//       {loading ? (
//         data?.map((data: any, i: number) => {
//           return (
//             <TableRowLoading
//               key={i}
//               item={i}
//               togglePanel={togglePanel}
//               activeIndex={activeIndex}
//               data={data}
//               itemLoadingTemplate={TableItemLoading}
//             />
//           );
//         })
//       ) : // mapping loading view when a table is in loading state
//       filteredData?.length ? (
//         filteredData?.map((data: any, i: number) => (
//           <TableItem
//             data={data}
//             index={i}
//             activeIndex={activeIndex === i}
//             itemTemplateLoading={TableItemLoading}
//             setDragType={setDragType}
//             childActiveIndex={childActiveIndex}
//             handleData={handleData}
//             loading={loading}
//             togglePanel={togglePanel}
//             key={i}
//           />
//         ))
//       ) : (
//         <div className={styles.panelContainer}>
//           <span className={styles.errorMsg}>
//             <p>"{searchTerm}"</p> Not found !
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(Table);

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { memo, useEffect, useState } from "react";
// import styles from "./Table.module.scss"; // Importing the SCSS module
// import { TableRowLoading } from "./LoadingTemplates/TableRowLoading";
// import TableItem from "./TableItem";
// import { TableItemLoading } from "./LoadingTemplates/TableItemLoading";

// interface ITableProps {
//   headers: string[];
//   data: any[]; // Replace any with appropriate type
//   loading: boolean;
//   searchTerm: string;
// }

// interface LibraryItem {
//   name: string;
//   url: string;
//   fields: any;
//   items?: LibraryItem[] | undefined;
// }

// const Table: React.FC<ITableProps> = ({
//   headers,
//   data,
//   loading,
//   searchTerm,
// }: ITableProps): JSX.Element => {
//   const loaderTemplateData: any = [
//     {
//       name: "",
//       url: "",
//       fields: {
//         name: "",
//         status: "",
//         nextReview: "",
//         createdDate: "",
//         isVisible: "",
//         Action: "",
//       },
//       items: [
//         {
//           name: "",
//           url: "",
//           fields: "",
//         },
//       ],
//     },
//   ];
//   const [DNDData, setDNDData] = useState(data);
//   console.log("DNDData: ", DNDData);
//   const [activeIndex, setActiveIndex] = useState<number>(-1);
//   const [childActiveIndex, setChildActiveIndex] = useState<number>(-1);
//   const [dragType, setDragType] = useState<string>("");

//   useEffect(() => {
//     setDNDData(loading ? loaderTemplateData : data);
//   }, [data]);

//   const handleData = (
//     newData: any,
//     type: string,
//     parentIndex: number,
//     childIndex: number
//   ): void => {
//     if (type !== dragType) {
//       alert("Can't drag Documents to other sections.");
//       return;
//     }

//     setDNDData((prevData) => {
//       const updatedData = [...prevData];

//       // Check if parentIndex is within bounds
//       if (parentIndex >= 0 && parentIndex < updatedData.length) {
//         // Handle parent type
//         if (type === "parent") {
//           // Safely update items using optional chaining
//           updatedData[parentIndex].items = newData;
//         } else {
//           // Check if items array exists and if childIndex is within bounds
//           if (
//             updatedData[parentIndex].items &&
//             childIndex >= 0 &&
//             childIndex < updatedData[parentIndex]?.items?.length
//           ) {
//             // Safely update nested items using optional chaining
//             updatedData[parentIndex].items[childIndex].items = newData;
//           }
//         }
//       }

//       return updatedData;
//     });
//   };

//   const togglePanel = (index: number, child = false): void => {
//     if (child) {
//       setChildActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
//     } else {
//       setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
//       setChildActiveIndex(-1);
//     }
//   };

//   const filterData = (searchTerm: string): LibraryItem[] => {
//     return DNDData.filter((item) => {
//       const matchingChildren = item.items?.filter((child: any) =>
//         child.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       return (
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (matchingChildren && matchingChildren.length > 0)
//       );
//     });
//   };

//   const filteredData = loading ? DNDData : filterData(searchTerm);
//   console.log("filteredData: ", filteredData);

//   return (
//     // wrapper of the whole table data component
//     <div className={styles.tableWrapper}>
//       {/* mapping all the headers of the table headers data  */}
//       <div className={styles.tableHeadersWrapper}>
//         {headers?.map((el, i) => (
//           <div key={i} className={styles.tableHeader}>
//             <span>{el}</span>
//           </div>
//         ))}
//       </div>

//       {/* mapping the data of the draggable table rows & columns */}
//       {loading ? (
//         DNDData?.map((data, i) => (
//           <TableRowLoading
//             key={i}
//             item={i}
//             togglePanel={togglePanel}
//             activeIndex={activeIndex}
//             data={data}
//             itemLoadingTemplate={TableItemLoading}
//           />
//         ))
//       ) : // mapping loading view when a table is in loading state
//       filteredData?.length ? (
//         filteredData?.map((data, i) => (
//           <TableItem
//             data={data}
//             index={i}
//             activeIndex={activeIndex === i}
//             itemTemplateLoading={TableItemLoading}
//             setDragType={setDragType}
//             childActiveIndex={childActiveIndex}
//             handleData={handleData}
//             loading={loading}
//             togglePanel={togglePanel}
//             key={i}
//           />
//         ))
//       ) : (
//         <div className={styles.panelContainer}>
//           <span className={styles.errorMsg}>
//             <p>"{searchTerm}"</p> Not found !
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(Table);
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import { memo, useEffect, useState } from "react";
import styles from "./Table.module.scss"; // Importing the SCSS module
import { TableRowLoading } from "./LoadingTemplates/TableRowLoading";
import TableItem from "./TableItem";
import { TableItemLoading } from "./LoadingTemplates/TableItemLoading";

interface ITableProps {
  headers: string[];
  data: any[]; // Replace any with appropriate type
  loading: boolean;
  searchTerm: string;
}

interface LibraryItem {
  name: string;
  url: string;
  fields: any;
  items?: LibraryItem[] | undefined;
}

const Table: React.FC<ITableProps> = ({
  headers,
  data,
  loading,
  searchTerm,
}: ITableProps): JSX.Element => {
  const loaderTemplateData: any = [
    {
      name: "",
      url: "",
      fields: {
        name: "",
        status: "",
        nextReview: "",
        createdDate: "",
        isVisible: "",
        Action: "",
      },
      items: [
        {
          name: "",
          url: "",
          fields: "",
        },
      ],
    },
  ];
  const [DNDData, setDNDData] = useState(data);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [childActiveIndex, setChildActiveIndex] = useState<number>(-1);
  const [dragType, setDragType] = useState<string>("");

  useEffect(() => {
    setDNDData(loading ? loaderTemplateData : data);
  }, [data, loading]);

  const handleData = (
    newData: any,
    type: string,
    parentIndex: number,
    childIndex: number
  ): void => {
    if (type !== dragType) {
      alert("Can't drag Documents to other sections.");
      return;
    }

    setDNDData((prevData) => {
      const updatedData = [...prevData];

      // Check if parentIndex is within bounds
      if (parentIndex >= 0 && parentIndex < updatedData.length) {
        // Handle parent type
        if (type === "parent") {
          // Safely update items using optional chaining
          updatedData[parentIndex].items = newData;
        } else {
          // Check if items array exists and if childIndex is within bounds
          if (
            updatedData[parentIndex].items &&
            childIndex >= 0 &&
            childIndex < updatedData[parentIndex]?.items?.length
          ) {
            // Safely update nested items using optional chaining
            updatedData[parentIndex].items[childIndex].items = newData;
          }
        }
      }

      return updatedData;
    });
  };

  const togglePanel = (index: number, child = false): void => {
    if (child) {
      setChildActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
    } else {
      setActiveIndex((prevIndex) => (prevIndex === index ? -1 : index));
      setChildActiveIndex(-1);
    }
  };

  const filterData = (searchTerm: string): LibraryItem[] => {
    return DNDData.filter((item) => {
      const matchingChildren = item.items?.filter((child: any) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (matchingChildren && matchingChildren.length > 0)
      );
    });
  };

  const filteredData = loading ? DNDData : filterData(searchTerm);

  return (
    // wrapper of the whole table data component
    <div className={styles.tableWrapper}>
      {/* mapping all the headers of the table headers data  */}
      <div className={styles.tableHeadersWrapper}>
        {headers?.map((el, i) => (
          <div key={i} className={styles.tableHeader}>
            <span>{el}</span>
          </div>
        ))}
      </div>

      {/* mapping the data of the draggable table rows & columns */}
      {loading ? (
        DNDData?.map((data, i) => (
          <TableRowLoading
            key={i}
            item={i}
            togglePanel={togglePanel}
            activeIndex={0}
            data={data}
            itemLoadingTemplate={TableItemLoading}
          />
        ))
      ) : // mapping loading view when a table is in loading state
      filteredData?.length ? (
        filteredData?.map((data, i) => (
          <TableItem
            data={data}
            index={i}
            activeIndex={activeIndex === i}
            itemTemplateLoading={TableItemLoading}
            setDragType={setDragType}
            childActiveIndex={childActiveIndex}
            handleData={handleData}
            loading={loading}
            togglePanel={togglePanel}
            key={i}
          />
        ))
      ) : (
        <div className={styles.panelContainer}>
          <span className={styles.errorMsg}>
            <p>"{searchTerm}"</p> Not found !
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(Table);
