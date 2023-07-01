import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import styles from "./MultipleInputs.module.css";

const MultipleInputs = (props) => {
  let multiInput = <div></div>;
  if (props.type === "dropdown-w-input") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Dropdown options={props.options} classLabel="multi-inputs-l" />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Input type="number" classLabel="multi-inputs-r" />
        </div>
      </div>
    );
  } else if (props.type === "input-w-btn") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Input type="text" classLabel="multi-inputs-l" />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Button type="button" classLabels={["multi-inputs-r", "secondary"]}>
            <Icon name="check" />
          </Button>
        </div>
      </div>
    );
  } else if (props.type === "input-with-num") {
    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg"]}`}
        >
          <Input type="text" classLabel="multi-inputs-l" />
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm"]}`}
        >
          <Input type="num" classLabel="multi-inputs-r" />
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
