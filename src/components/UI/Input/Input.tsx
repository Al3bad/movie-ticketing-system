import React from "react";
import styles from "./Input.module.css";

type InputProps = {
  label: string;
  classLabel?: string;
  onInputChange: (name: string, val: string | number) => void;
};

const Input: React.FC<InputProps> = ({label, classLabel, onInputChange,...inputAttr}) => {
  const inputChangeHandler = (e) => {
    onInputChange(label, e.target.value);
  }
  return (
    <div
      className={`${styles["input-field"]} ${
        classLabel ? styles[`input-field--${classLabel}`] : ""
      }`}
    >
      {!classLabel?.includes("multi-inputs") && <label>{label}</label>}
      <input {...inputAttr} onChange={inputChangeHandler} />
    </div>
  );
};

export default Input;
