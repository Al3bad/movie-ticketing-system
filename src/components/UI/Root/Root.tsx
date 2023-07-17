import React from "react";
import { Outlet } from "react-router-dom";

import styles from "./Root.module.css";
import NavBar from "../NavBar/NavBar";

const Root: React.FC<RootProps> = (props) => {
  return (
    <main className={styles.container}>
      <nav className={styles.container__navbar}>
        <NavBar />
      </nav>
      <header className={styles.container__title}>
        <h1>{props.title ? props.title : ""}</h1>
      </header>
      <section className={styles.container__content}>
        <Outlet />
      </section>
    </main>
  );
};

export default Root;
