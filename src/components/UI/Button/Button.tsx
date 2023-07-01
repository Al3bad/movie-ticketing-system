import styles from "./Button.module.css";

const Button = ({children, type, classLabel}) => {
  return (
    <button
      onClick={props.onClick}
      type = {props.type}
      className={`${styles.button} ${styles[`button--${props.classLabel}`]}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
