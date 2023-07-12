import React from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  classLabels: string[];
  label?: string;
  onClick?: (text: string) => void;
  children?: any;
  type?: "submit" | "button" | "reset";
};

const Button: React.FC<ButtonProps> = (props) => {
  const classes = props.classLabels
    .map((label) => styles[`button--${label}`])
    .join(" ");

  const buttonClickHandler = () => {
    if (props.onClick) {
      props.onClick(props.label);
    }
  };

  return (
    <button
      type={props.type}
      className={`${styles.button} ${classes}`}
      onClick={buttonClickHandler}
    >
      {props.label}
      <span>{props.children}</span>
    </button>
  );
};

export default Button;
