import React from "react";
import styles from "./Dropdown.module.css";

type Option = {
  id: string | number;
  value: string;
}
type DropdownProps = {
  label: string;
  classLabel?: string;
  options: Option[];
  onInputChange: (name: string, val: string | number) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  classLabel,
  options,
  onInputChange,
}) => {
  const dropdownHandler = (e) => {
    onInputChange(label, e.target.value);
  };
  return (
    <div
      className={`${styles.dropdown} ${
        classLabel ? styles[`dropdown--${classLabel}`] : ""
      }`}
    >
      {!classLabel?.includes("multi-inputs") && <label>{label}</label>}
      <select onChange={dropdownHandler} defaultValue={"DEFAULT"}>
        <option value="DEFAULT" disabled>
          Select an option...
        </option>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.value}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
