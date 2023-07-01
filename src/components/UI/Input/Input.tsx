import React from "react";
import styles from "./Input.module.css";

type InputProps = {
  label?: string;
  classLabel?: string;
};

const Input: React.FC<InputProps> = ({ label, classLabel, ...inputAttr }) => {
  return (
    <div
      className={`${styles["input-field"]} ${
        classLabel ? styles[`input-field--${classLabel}`] : ""
      }`}
    >
      {label && <label>{label}</label>}
      <input {...inputAttr} />
    </div>
  );
};

export default Input;
