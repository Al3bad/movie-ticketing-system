import { useRouteError } from "react-router-dom";
import NavBar from "../../UI/NavBar/NavBar";
import styles from "./Error.module.css";

const Error = () => {
  const error = useRouteError();
  let message = "";
  let status = "";
  if (error) {
    if (error.message) {
      message = error.message;
    } else {
      message = error.statusText; // default error message of useRouterError
    }

    if (error.status) {
      status = error.status;
    }
  }
  return (
    <div className={styles.container}>
      <NavBar className={styles.container__navbar} />
      <main className={styles.container__content}>
        <h1>{status}</h1>
        <h1>{message}</h1>
      </main>
    </div>
  );
};

export default Error;
