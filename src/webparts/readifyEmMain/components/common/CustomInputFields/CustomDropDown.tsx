/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { memo, useCallback } from "react";
import styles from "./Inputs.module.scss";
import { MenuItem, Select } from "@mui/material";

interface Props {
  value: string | number | any;
  options: any[];
  onChange: (value: string | any) => void;
  placeholder?: string;
  size?: "SM" | "MD" | "XL";
}

const CustomDropDown: React.FC<Props> = ({
  value,
  options,
  onChange,
  placeholder = "",
  size = "MD",
}) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e?.target.value);
    },
    [onChange]
  );

  // Concatenate the size with the style class name
  const sizeClassName = styles[`customDropDownInput${size}`];
  // const sizeHeights = size==="SM" ?"35.5px":size==="MD"?""
  return (
    // <Select
    //   value={value}
    //   className={sizeClassName}
    //   onChange={handleChange}
    //   displayEmpty
    //   inputProps={{ "aria-label": "Without label" }}
    // >
    //   <MenuItem value={placeholder}>
    //     <em>{placeholder}</em>
    //   </MenuItem>
    //   {options?.map((e, i) => (
    //     <MenuItem key={i} value={e?.value}>
    //       {e.label}
    //     </MenuItem>
    //   ))}
    // </Select>

    <Select
      value={value || ""}
      className={sizeClassName}
      onChange={handleChange}
      displayEmpty
      placeholder={placeholder}
      renderValue={(selected) => {
        if (!selected) {
          return <span className={styles.placeHolder}>{placeholder}</span>;
        }
        return selected;
      }}
      inputProps={{ "aria-label": "Without label" }}
      MenuProps={{
        sx: {
          ".MuiMenu-paper": {
            bottom: "10px !important",
            maxHeight: "200px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1) !important",
            // border:"1px solid #eee !important"
          },
          ".Mui-selected": {
            backgroundColor: "#C9B7FF40 !important",
            "&:hover": {
              backgroundColor: "#C9B7FF40 !important",
            },
          },
        },
      }}
      sx={{
        ".MuiOutlinedInput-notchedOutline": {
          border: "0",
        },
        ":root": {
          padding: "0 !important",
          ".MuiSelect-select": {
            padding: "0 !important",
          },
        },
        fontWeight: "400",
        padding: "0",
        height: "34px",
        minWidth: "276px",
        outline: "none",
      }}
    >
      <MenuItem
        sx={{
          color: "#555 !important",
        }}
        disabled={true}
        value={placeholder}
      >
        {placeholder}
      </MenuItem>
      {options?.map((option: any, i: number) => (
        <MenuItem
          key={i}
          // sx={{
          //   color:
          //     option?.value === options[0].value
          //       ? "#adadad !important"
          //       : "#414141 ",
          // }}
          value={option}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

export default memo(CustomDropDown);
