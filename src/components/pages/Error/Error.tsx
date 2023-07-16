import NavBar from "../../UI/NavBar/NavBar";
import styles from "./Error.module.css";

const Error = () => {
  return (
    <div className={styles.container}>
      <NavBar className={styles.container__navbar} />
      <main className={styles.container__content}>
        <h1>Page Not Found</h1>
        <p>An Error Occurred!</p>
      </main>
    </div>
  );
};

export default Error;
