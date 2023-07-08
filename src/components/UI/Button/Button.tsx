import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  classLabels: string[];
  label: string;
  onButtonClick?: (text: string) => void;
  children?: any;
};

const Button: React.FC<ButtonProps> = ({
  children,
  label,
  classLabels,
  onButtonClick,
  ...btnAttr
}) => {
  const classes = classLabels
    .map((label) => styles[`button--${label}`])
    .join(" ");
  const buttonClickHandler = () => {
    if (onButtonClick) {
      onButtonClick(label);
    }
  };
  return (
    <button
      {...btnAttr}
      className={`${styles.button} ${classes}`}
      onClick={buttonClickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
