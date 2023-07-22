import React from "react";
import styles from "./Input.module.css";

type InputProps = {
  label: string;
  classLabel?: string;
  isDisabled?: boolean;
  type?: string;
  name?: string;
  value?: string | number;
  onChange: (name: string, val: string | number) => void;
};

const Input: React.FC<InputProps> = ({
  label,
  classLabel,
  type = "text",
  isDisabled = false,
  name,
  value,
  onChange,
}) => {
  const inputChangeHandler = (e) => {
    onChange(label, e.target.value);
  };
  return (
    <div
      className={`${styles["input-field"]} ${
        classLabel ? styles[`input-field--${classLabel}`] : ""
      }`}
    >
      {!classLabel?.includes("multi-inputs") && <label>{label}</label>}
      <input
        type={type}
        onChange={inputChangeHandler}
        disabled={isDisabled}
        name={name}
        value={value}
      />
    </div>
  );
};

export default Input;
