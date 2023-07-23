import React from "react";
import styles from "./Dropdown.module.css";

type Option = {
  id: string | number;
  value: string;
};
type DropdownProps = {
  label: string;
  classLabel?: string;
  options: Option[];
  isDisabled?: boolean;
  value?: string;
  name?: string;
  onChange: (name: string, val: string | number) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  classLabel,
  options,
  isDisabled = false,
  value = undefined,
  name,
  onChange,
}) => {
  const dropdownHandler = (e) => {
    onChange(label, e.target.value);
  };
  return (
    <div
      className={`${styles.dropdown} ${
        classLabel ? styles[`dropdown--${classLabel}`] : ""
      }`}
    >
      {!classLabel?.includes("multi-inputs") && <label>{label}</label>}
      <select
        onChange={dropdownHandler}
        disabled={isDisabled}
        value={value ? value : "DEFAULT"}
        name={name}
      >
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
