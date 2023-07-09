import React from "react";

import styles from "./Layout.module.css";
import NavBar from "../NavBar/NavBar";

type LayoutProps = {
  title: string;
};

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <main className={styles.container}>
      <nav className={styles.container__navbar}>
        <NavBar />
      </nav>
      <header className={styles.container__title}>
        <h1>{props.title}</h1>
      </header>
      <section className={styles.container__content}>{props.children}</section>
    </main>
  );
};

export default Layout;
