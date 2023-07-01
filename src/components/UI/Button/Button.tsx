import styles from "./Button.module.css";

const Button = ({children, classLabels, ...btnAttr}) => {
  const classes = classLabels.map((label) => styles[`button--${label}`]).join(" ");
  return (
    <button
      {...btnAttr}
      className={`${styles.button} ${classes}`}
    >
      {children}
    </button>
  );
};

export default Button;
