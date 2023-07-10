import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";

type Header = {
  title: string;
  key: string;
};

type TableProps = {
  values: any;
  headers: Header[];
};

const Table: React.FC<TableProps> = (props) => {
  const [isResized, setIsResized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [headerValues, setHeaderValues] = useState<Header[]>([]);

  useEffect(() => {
    // Handle screen resize
    if (!isResized) {
      screenSizeHandler();
    }
    checkScreenResize();

    // Set Table Values
    if (props.values) {
      if (!isMobile) {
        // On desktop, display all columns passed in props.headers
        setHeaderValues(props.headers);
      } else {
        // On mobile, display only the first 2 columns of the table
        setHeaderValues((current_values) => [...current_values].slice(0, 2));
      }
    }
  }, [isResized, isMobile]);

  const checkScreenResize = () => {
    window.addEventListener("resize", () => {
      if (!isResized) {
        setIsResized(true);
      }
      screenSizeHandler();
    });
  };

  const screenSizeHandler = () => {
    if (window.innerWidth > 760) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.table__header}>
          {headerValues.map((header) => (
            <th key={header.key}>{header.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.values.map((movie: Movie, movie_id: number) => {
          return (
            <tr key={movie_id} className={styles.table__content}>
              {headerValues.map((header, header_id: number) => {
                return <td key={header_id}>{movie[header.key]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
