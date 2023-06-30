import styles from "./Dropdown.module.css";

const Dropdown = (props) => {
  return (
    <div className={styles.dropdown}>
      <label>{props.label}</label>
      <select>
        {props.options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
