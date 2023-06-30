import styles from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type={props.type}
      className={`${styles.button} ${styles[`button--${props.classLabel}`]}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
