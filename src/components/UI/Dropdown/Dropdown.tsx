import React from "react";
import styles from "./Dropdown.module.css";

type Option = {
  id: number;
  value: string;
};

type DropdownProps = {
  label?: string;
  classLabel?: string;
  options: Option[];
};

const Dropdown: React.FC<DropdownProps> = (props) => {
  return (
    <div
      className={`${styles.dropdown} ${
        props.classLabel ? styles[`dropdown--${props.classLabel}`] : ""
      }`}
    >
      <label>{props.label}</label>
      <select>
        {props.options.map((option: Option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
