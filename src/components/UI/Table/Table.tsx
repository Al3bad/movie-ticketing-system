import React, { ReactNode } from "react";
import styles from "./Table.module.css";

type TableProps = {
  values: any;
  type: string;
};

const Table: React.FC<TableProps> = (props) => {
  let content: ReactNode;
  let headers: ReactNode;
  if (props.type === "movie") {
    const headerTitles = ["Title", "Seat Available"];
    headers = headerTitles.map((header, id) => <th key={id}>{header}</th>);
    content = props.values.map((movie: Movie) => {
      return (
        <tr key={movie.title} className={styles.table__content}>
          <td>{movie.title}</td>
          <td>{movie.seatAvailable}</td>
        </tr>
      );
    });
  }
  return (
    <table className={styles.table}>
      <tr className={styles.table__header}>{headers}</tr>
      {content}
    </table>
  );
};

export default Table;
