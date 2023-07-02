import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import styles from "./MultipleInputs.module.css";

type MultipleInputsProps = {
  type: string;
  label: string;
  hide_label: boolean;
  options?: Movie[] | Ticket[];
  onInputChange?: (label: string, val: string | number) => void;
  onButtonClick?: () => void;
};
const MultipleInputs: React.FC<MultipleInputsProps> = ({
  type,
  label,
  hide_label = false,
  options,
  onInputChange,
  onButtonClick,
}) => {
  const inputHandler = (label: string, val: string | number) => {
    if (onInputChange) {
      onInputChange(`${label} input`, val);
    }
  };

  const dropdownHandler = (label: string, val: string | number) => {
    if (onInputChange) {
      onInputChange(`${label} option`, val);
    }
  };

  const buttonClickHandler = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  let multiInput = <div></div>;

  if (type === "dropdown-w-input") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Dropdown
            options={options}
            label={label}
            classLabel="multi-inputs-l"
            onInputChange={dropdownHandler}
          />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Input
            type="number"
            label={label}
            classLabel="multi-inputs-r"
            onInputChange={inputHandler}
          />
        </div>
      </div>
    );
  } else if (type === "input-w-btn") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Input
            type="text"
            label={label}
            classLabel="multi-inputs-l"
            onInputChange={inputHandler}
          />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Button
            type="button"
            label={label}
            classLabels={["multi-inputs-r", "secondary"]}
            onButtonClick={buttonClickHandler}
          >
            <Icon name="check" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!hide_label && <p>{label}</p>}
      {multiInput}
    </div>
  );
};

export default MultipleInputs;
