import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";
import styles from "./MultipleInputs.module.css";

const MultipleInputs = (props) => {
  
  let multiInput = (
    <div className={styles["multi-inputs"]}>
      <div
        className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg-block"]}`}
      >
        <Dropdown options={props.options} classLabel="multi-inputs"/>
      </div>
      <div
        className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm-block"]}`}
      >
        <Input type="number" classLabel="multi-inputs"/>
      </div>
    </div>
  );

  if (props.type === "input-w-btn") {

    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg-block"]}`}
        >
          <Input type="text" classLabel="multi-inputs"/>
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm-block"]}`}
        >
          <Button type="button" classLabel="multi-inputs"><Icon name="check"/></Button>
        </div>
      </div>
    );

  } else if (props.type === "input-with-num") {

    multiInput = (
      <div className={styles["multi-inputs"]}>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__lg-block"]}`}
        >
          <Input type="text" classLabel="multi-inputs"/>
        </div>
        <div
          className={`${styles["multi-inputs"]} ${styles["multi-inputs__sm-block"]}`}
        >
          <Input type="num" classLabel="multi-inputs"/>
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
