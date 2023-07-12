import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Table.module.css";

type Header = {
  title: string;
  key: string;
};

type TableProps = {
  values: any;
  headers: Header[];
  // key of the value that will be used to navigate to Detail pages
  // e.g: customerDetail: email, movie: title, booking: id,...
  id: any;
  path: string;
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
    <>
      <p className={styles.table__total}>
        <b>Total: {props.values.length}</b>
      </p>
      <table className={styles.table}>
        <thead>
          <tr className={styles.table__header}>
            {headerValues.map((header) => (
              <th key={header.key}>{header.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.values.map((value) => {
            return (
              <tr key={value[props.id]} className={styles.table__content}>
                {headerValues.map((header, header_id: number) => {
                  return (
                    <td key={header_id}>
                      <Link to={`${props.path}/${value[props.id]}`}>
                        {value[header.key]}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
