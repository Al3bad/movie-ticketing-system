import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import styles from "./MultipleInputs.module.css";

const MultipleInputs = (props) => {
  const inputHandler = (label: string, val: string | number) => {
    props.onInputChange(`${label} input`, val);
  };

  const dropdownHandler = (label: string, val: string | number) => {
    props.onInputChange(`${label} option`, val);
  };

  const buttonClickHandler = () => {
    props.onButtonClick();
  };

  let multiInput = <div></div>;

  if (props.type === "dropdown-w-input") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Dropdown
            options={props.options}
            label={props.label}
            classLabel="multi-inputs-l"
            onInputChange={dropdownHandler}
          />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Input
            type="number"
            label={props.label}
            classLabel="multi-inputs-r"
            onInputChange={inputHandler}
          />
        </div>
      </div>
    );
  } else if (props.type === "input-w-btn") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Input
            type="text"
            label={props.label}
            classLabel="multi-inputs-l"
            onInputChange={inputHandler}
          />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Button type="button" label={props.label} classLabels={["multi-inputs-r", "secondary"]} onButtonClick={buttonClickHandler}>
            <Icon name="check" />
          </Button>
        </div>
      </div>
    );
  } 

  return (
    <div>
      <p>{props.label}</p>
      {multiInput}
    </div>
  );
};

export default MultipleInputs;
